/**
 * Health Scanner - Parallel code quality scanner for Dev Maestro
 *
 * Runs multiple health checks in parallel and returns aggregated results:
 * - TypeScript errors (vue-tsc)
 * - ESLint issues
 * - Dead code (knip)
 * - Security vulnerabilities (npm audit)
 * - Outdated dependencies
 * - Bundle size
 * - Test coverage
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Project root (dev-maestro is in a subdirectory)
const PROJECT_ROOT = path.resolve(__dirname, '../..');

// Scanner timeout (60 seconds per scanner)
const SCANNER_TIMEOUT = 60000;

// Cache directory
const CACHE_DIR = path.join(__dirname, '../.health-cache');

/**
 * Run a command with timeout support
 */
function runCommand(command, args = [], options = {}) {
    return new Promise((resolve) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), options.timeout || SCANNER_TIMEOUT);

        const proc = spawn(command, args, {
            cwd: options.cwd || PROJECT_ROOT,
            signal: controller.signal,
            shell: true,
            env: { ...process.env, FORCE_COLOR: '0' }
        });

        let stdout = '';
        let stderr = '';

        proc.stdout?.on('data', (data) => {
            const str = data.toString();
            stdout += str;
            if (options.onLog) options.onLog(str);
        });

        proc.stderr?.on('data', (data) => {
            const str = data.toString();
            stderr += str;
            if (options.onLog) options.onLog(str);
        });

        proc.on('close', (code) => {
            clearTimeout(timeout);
            resolve({ code, stdout, stderr, timedOut: false });
        });

        proc.on('error', (err) => {
            clearTimeout(timeout);
            if (err.name === 'AbortError') {
                resolve({ code: -1, stdout, stderr, timedOut: true, error: 'Timeout' });
            } else {
                resolve({ code: -1, stdout, stderr, timedOut: false, error: err.message });
            }
        });
    });
}

/**
 * A check that cannot produce a real result is "not measured": it carries a reason and no numbers,
 * so it can never be mistaken for a clean 0 and is left out of the score.
 */
function notMeasured(reason, extra = {}) {
    return { status: 'not-measured', measured: false, reason, ...extra };
}

function hasAny(root, names) {
    return names.some(name => fs.existsSync(path.join(root, name)));
}

function readPackageJson(root) {
    try { return JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')); } catch { return null; }
}

// First useful line of a failed tool run, for the "why not measured" text.
function firstLine(text) {
    return String(text || '').split('\n').map(l => l.trim()).find(Boolean)?.slice(0, 160) || 'no output';
}

// Tool never started (not installed, or it printed its help instead of checking anything).
function toolDidNotRun(result) {
    if (result.error) return true;
    const out = `${result.stdout}\n${result.stderr}`;
    return /command not found|not found|could not determine executable|ENOENT|npm error code E404|Unknown command|Usage:|Common Commands|tsc: The TypeScript Compiler/i.test(out);
}

/**
 * Scan TypeScript errors using vue-tsc
 */
async function scanTypeScript(onLog, root = PROJECT_ROOT) {
    if (onLog) onLog('Starting TypeScript scan...\n');
    if (!hasAny(root, ['tsconfig.json'])) return notMeasured('No TypeScript setup (no tsconfig.json) in this project.');
    const pkg = readPackageJson(root) || {};
    const usesVue = Boolean({ ...pkg.dependencies, ...pkg.devDependencies }.vue);
    const result = await runCommand('npx', ['--no-install', usesVue ? 'vue-tsc' : 'tsc', '--noEmit', '--pretty', 'false'], {
        timeout: SCANNER_TIMEOUT,
        cwd: root,
        onLog
    });

    if (result.timedOut) return notMeasured('The type check took too long and was stopped.');
    if (toolDidNotRun(result)) return notMeasured(`The type checker could not run: ${firstLine(result.stderr || result.stdout)}`);

    // Parse TypeScript errors from stderr
    const errors = [];
    const lines = (result.stderr + result.stdout).split('\n');
    const errorRegex = /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.+)$/;

    for (const line of lines) {
        const match = line.match(errorRegex);
        if (match) {
            errors.push({
                file: match[1],
                line: parseInt(match[2]),
                column: parseInt(match[3]),
                severity: match[4],
                code: match[5],
                message: match[6]
            });
        }
    }

    // Also try simpler pattern for some error formats
    const simpleRegex = /error TS\d+:/g;
    const simpleMatches = (result.stderr + result.stdout).match(simpleRegex) || [];

    // Failed, but no error line we can read: that is a broken run, not a count.
    if (result.code !== 0 && errors.length === 0 && simpleMatches.length === 0) {
        return notMeasured(`The type checker failed without a readable error list: ${firstLine(result.stderr || result.stdout)}`);
    }

    return {
        status: result.code === 0 ? 'healthy' : 'error',
        errors: errors.slice(0, 50), // Limit to 50 for display
        count: Math.max(errors.length, simpleMatches.length),
        raw: result.code !== 0 ? (result.stderr || result.stdout).slice(0, 2000) : null
    };
}

/**
 * Scan ESLint issues
 */
async function scanESLint(onLog, root = PROJECT_ROOT) {
    if (onLog) onLog('Starting ESLint scan...\n');
    const pkgForLint = readPackageJson(root) || {};
    if (!hasAny(root, ['eslint.config.js', 'eslint.config.mjs', 'eslint.config.cjs', 'eslint.config.ts', '.eslintrc', '.eslintrc.js', '.eslintrc.cjs', '.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml']) && !pkgForLint.eslintConfig) {
        return notMeasured('No ESLint setup in this project.');
    }
    if (!fs.existsSync(path.join(root, 'src'))) return notMeasured('No src folder to lint.');
    // Don't pass onLog to runCommand to avoid streaming raw JSON
    const result = await runCommand('npx', ['--no-install', 'eslint', 'src', '--format', 'json', '--max-warnings', '9999'], {
        timeout: SCANNER_TIMEOUT,
        cwd: root
    });

    if (result.timedOut) return notMeasured('The lint run took too long and was stopped.');
    if (toolDidNotRun(result) && !result.stdout.trim().startsWith('[')) return notMeasured(`ESLint could not run: ${firstLine(result.stderr || result.stdout)}`);

    try {
        // ESLint outputs JSON to stdout
        const json = JSON.parse(result.stdout);
        let errorCount = 0;
        let warningCount = 0;
        let fixableCount = 0;
        const filesWithIssues = [];

        for (const file of json) {
            errorCount += file.errorCount || 0;
            warningCount += file.warningCount || 0;
            fixableCount += (file.fixableErrorCount || 0) + (file.fixableWarningCount || 0);

            if (file.errorCount > 0 || file.warningCount > 0) {
                filesWithIssues.push({
                    file: path.relative(root, file.filePath),
                    errors: file.errorCount,
                    warnings: file.warningCount,
                    messages: (file.messages || []).slice(0, 5).map(m => ({
                        line: m.line,
                        severity: m.severity === 2 ? 'error' : 'warning',
                        message: m.message,
                        ruleId: m.ruleId
                    }))
                });
            }
        }

        return {
            status: errorCount > 0 ? 'error' : warningCount > 0 ? 'warning' : 'healthy',
            errors: errorCount,
            warnings: warningCount,
            fixable: fixableCount,
            files: filesWithIssues.slice(0, 20)
        };
    } catch (e) {
        return notMeasured(`ESLint output could not be read: ${firstLine(result.stderr || result.stdout)}`);
    }
}

/**
 * Scan dead code using knip
 */
async function scanDeadCode(onLog, root = PROJECT_ROOT) {
    if (onLog) onLog('Starting Dead Code scan (knip)...\n');
    if (!hasAny(root, ['package.json'])) return notMeasured('Not a JavaScript project (no package.json).');
    const result = await runCommand('npx', ['--no-install', 'knip', '--reporter', 'json'], {
        timeout: SCANNER_TIMEOUT,
        cwd: root
    });

    if (result.timedOut) return notMeasured('The dead code scan took too long and was stopped.');
    if (toolDidNotRun(result)) return notMeasured(`Knip could not run: ${firstLine(result.stderr || result.stdout)}`);

    try {
        const json = JSON.parse(result.stdout);

        const unusedFiles = json.files || [];
        const unusedExports = json.exports || [];
        const unusedDeps = json.dependencies || [];

        return {
            status: unusedFiles.length > 10 ? 'error' : unusedFiles.length > 2 ? 'warning' : 'healthy',
            files: unusedFiles.length,
            exports: unusedExports.length,
            dependencies: unusedDeps.length,
            unusedFiles: unusedFiles.slice(0, 10),
            unusedDeps: unusedDeps.slice(0, 10)
        };
    } catch (e) {
        // Knip might output non-JSON on success
        if (result.code === 0 && !result.stdout.trim()) {
            return { status: 'healthy', files: 0, exports: 0, dependencies: 0 };
        }
        return notMeasured(`Knip output could not be read: ${firstLine(result.stderr || result.stdout)}`);
    }
}

/**
 * Scan npm audit for security vulnerabilities
 */
async function scanAudit(onLog, root = PROJECT_ROOT) {
    if (onLog) onLog('Starting Security Audit...\n');
    if (!hasAny(root, ['package-lock.json', 'npm-shrinkwrap.json'])) return notMeasured('No package-lock.json, so there is nothing to audit.');
    const result = await runCommand('npm', ['audit', '--json'], {
        timeout: SCANNER_TIMEOUT,
        cwd: root
    });

    if (result.timedOut) return notMeasured('The security audit took too long and was stopped.');

    try {
        const json = JSON.parse(result.stdout);
        if (json.error || !json.metadata?.vulnerabilities) {
            return notMeasured(`The security audit did not return a result: ${json.error?.summary || json.error?.code || 'no vulnerability data'}`);
        }
        const vulns = json.metadata?.vulnerabilities || {};

        const total = (vulns.critical || 0) + (vulns.high || 0) + (vulns.moderate || 0) + (vulns.low || 0);

        return {
            status: vulns.critical > 0 || vulns.high > 0 ? 'error' : total > 3 ? 'warning' : 'healthy',
            total,
            critical: vulns.critical || 0,
            high: vulns.high || 0,
            moderate: vulns.moderate || 0,
            low: vulns.low || 0
        };
    } catch (e) {
        return notMeasured(`The security audit output could not be read: ${firstLine(result.stderr || result.stdout)}`);
    }
}

/**
 * Check for outdated dependencies
 */
async function scanOutdated(onLog, root = PROJECT_ROOT) {
    if (onLog) onLog('Checking for outdated dependencies...\n');
    if (!hasAny(root, ['package.json'])) return notMeasured('Not a JavaScript project (no package.json).');
    const result = await runCommand('npm', ['outdated', '--json'], {
        timeout: SCANNER_TIMEOUT,
        cwd: root
    });

    if (result.timedOut) return notMeasured('The outdated check took too long and was stopped.');
    if (!result.stdout.trim() && result.code !== 0) return notMeasured(`The outdated check failed: ${firstLine(result.stderr)}`);

    try {
        // npm outdated exits with code 1 if outdated packages exist
        const json = result.stdout ? JSON.parse(result.stdout) : {};
        const packages = Object.entries(json).map(([name, info]) => ({
            name,
            current: info.current,
            wanted: info.wanted,
            latest: info.latest,
            type: info.type
        }));

        const majorOutdated = packages.filter(p => {
            const current = (p.current || '').split('.')[0];
            const latest = (p.latest || '').split('.')[0];
            return current !== latest;
        });

        return {
            status: packages.length > 15 ? 'error' : packages.length > 5 ? 'warning' : 'healthy',
            count: packages.length,
            majorOutdated: majorOutdated.length,
            packages: packages.slice(0, 15)
        };
    } catch (e) {
        if (result.stdout === '') {
            // No outdated packages
            return { status: 'healthy', count: 0, packages: [] };
        }
        return notMeasured(`The outdated check output could not be read: ${firstLine(result.stderr || result.stdout)}`);
    }
}

/**
 * Calculate bundle size from dist folder
 */
async function scanBundleSize(onLog, root = PROJECT_ROOT) {
    if (onLog) onLog('Analyzing bundle size...\n');
    const distPath = path.join(root, 'dist', 'assets');

    try {
        if (!fs.existsSync(distPath)) {
            return notMeasured('No build folder found, so bundle size is unknown.');
        }

        const files = fs.readdirSync(distPath);
        let totalSize = 0;
        const chunks = [];

        for (const file of files) {
            const filePath = path.join(distPath, file);
            const stats = fs.statSync(filePath);
            totalSize += stats.size;

            if (file.endsWith('.js') || file.endsWith('.css')) {
                chunks.push({
                    name: file,
                    sizeKB: Math.round(stats.size / 1024)
                });
            }
        }

        const totalMB = totalSize / (1024 * 1024);

        // Sort by size descending
        chunks.sort((a, b) => b.sizeKB - a.sizeKB);

        return {
            status: totalMB > 2 ? 'error' : totalMB > 1.5 ? 'warning' : 'healthy',
            totalMB: Math.round(totalMB * 100) / 100,
            totalKB: Math.round(totalSize / 1024),
            chunks: chunks.slice(0, 10)
        };
    } catch (e) {
        return {
            status: 'warning',
            totalMB: 0,
            error: e.message
        };
    }
}

/**
 * Check test coverage
 */
async function scanCoverage(onLog, root = PROJECT_ROOT) {
    if (onLog) onLog('Checking test coverage...\n');
    const coveragePath = path.join(root, 'coverage', 'coverage-summary.json');

    try {
        if (!fs.existsSync(coveragePath)) {
            return notMeasured('No coverage report found, so test coverage is unknown.');
        }

        const data = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        const total = data.total || {};

        const lines = total.lines?.pct || 0;
        const branches = total.branches?.pct || 0;
        const functions = total.functions?.pct || 0;
        const statements = total.statements?.pct || 0;

        const average = (lines + branches + functions + statements) / 4;

        return {
            status: average < 60 ? 'error' : average < 80 ? 'warning' : 'healthy',
            coverage: Math.round(average),
            lines: Math.round(lines),
            branches: Math.round(branches),
            functions: Math.round(functions),
            statements: Math.round(statements)
        };
    } catch (e) {
        return {
            status: 'warning',
            coverage: 0,
            note: 'Unable to read coverage data'
        };
    }
}

/**
 * Check build status
 */
async function scanBuildStatus(onLog, root = PROJECT_ROOT) {
    if (onLog) onLog('Checking build status...\n');
    const distPath = path.join(root, 'dist');

    try {
        if (!fs.existsSync(distPath)) {
            return { status: 'warning', built: false, note: 'No build found' };
        }

        const indexPath = path.join(distPath, 'index.html');
        if (!fs.existsSync(indexPath)) {
            return { status: 'error', built: false, note: 'Build incomplete - missing index.html' };
        }

        const stats = fs.statSync(indexPath);
        const buildAge = Date.now() - stats.mtimeMs;
        const hoursAgo = Math.round(buildAge / (1000 * 60 * 60));

        return {
            status: 'healthy',
            built: true,
            lastBuild: stats.mtime.toISOString(),
            age: hoursAgo < 1 ? 'less than an hour ago' : `${hoursAgo} hours ago`
        };
    } catch (e) {
        return {
            status: 'error',
            built: false,
            error: e.message
        };
    }
}

/**
 * Calculate overall health score based on weighted metrics
 */
function calculateHealthScore(results) {
    const WEIGHTS = {
        typescript: 0.25,    // High - blocks runtime
        eslint: 0.15,        // Medium - code quality
        deadCode: 0.10,      // Low - maintenance burden
        coverage: 0.20,      // High - confidence
        bundleSize: 0.10,    // Low - performance
        audit: 0.15,         // High - security
        outdated: 0.05       // Low - maintenance
    };

    const scores = {
        typescript: results.typescript?.count === 0 ? 100 : Math.max(0, 100 - (results.typescript?.count || 0) * 5),
        eslint: Math.max(0, 100 - (results.eslint?.errors || 0) * 10 - (results.eslint?.warnings || 0) * 2),
        deadCode: Math.max(0, 100 - (results.deadCode?.files || 0) * 5),
        coverage: results.coverage?.coverage || 0,
        bundleSize: (results.bundleSize?.totalMB ?? 0) < 1.5 ? 100 : Math.max(0, 100 - (results.bundleSize.totalMB - 1.5) * 50),
        audit: results.audit?.total === 0 ? 100 : Math.max(0, 100 - (results.audit?.critical || 0) * 30 - (results.audit?.high || 0) * 15),
        outdated: Math.max(0, 100 - (results.outdated?.count || 0) * 3)
    };

    // Plain-language reasons, so the number can always be explained.
    const measured = {
        typescript: results.typescript?.count !== undefined,
        eslint: results.eslint?.errors !== undefined || results.eslint?.warnings !== undefined,
        deadCode: results.deadCode?.files !== undefined,
        coverage: typeof results.coverage?.coverage === 'number',
        bundleSize: typeof results.bundleSize?.totalMB === 'number',
        audit: results.audit?.total !== undefined,
        outdated: results.outdated?.count !== undefined
    };
    const notes = {
        typescript: measured.typescript ? (results.typescript.count === 0 ? 'No type errors.' : `${results.typescript.count} type errors, 5 points off each.`) : 'Not measured.',
        eslint: measured.eslint ? `${results.eslint?.errors || 0} errors (10 off each) and ${results.eslint?.warnings || 0} warnings (2 off each).` : 'Not measured.',
        deadCode: measured.deadCode ? `${results.deadCode.files} unused files, 5 points off each.` : 'Not measured.',
        coverage: measured.coverage ? `${results.coverage.coverage}% of the code is covered by tests.` : 'No coverage report found.',
        bundleSize: measured.bundleSize ? `${results.bundleSize.totalMB} MB; full marks under 1.5 MB.` : 'No build size found.',
        audit: measured.audit ? `${results.audit?.critical || 0} critical and ${results.audit?.high || 0} high security issues.` : 'Not measured.',
        outdated: measured.outdated ? `${results.outdated.count} outdated packages, 3 points off each.` : 'Not measured.'
    };
    const labels = { typescript: 'Type errors', eslint: 'Lint issues', deadCode: 'Dead code', coverage: 'Test coverage', bundleSize: 'Bundle size', audit: 'Security', outdated: 'Outdated packages' };
    // Only checks that were actually measured count; their weights are rescaled to 100%.
    // A missing tool (for example no coverage report) is left out, never scored as zero.
    const measuredKeys = Object.keys(WEIGHTS).filter(key => measured[key]);
    const measuredWeight = measuredKeys.reduce((sum, key) => sum + WEIGHTS[key], 0);
    const totalScore = measuredWeight
        ? measuredKeys.reduce((sum, key) => sum + (scores[key] || 0) * WEIGHTS[key], 0) / measuredWeight
        : 0;

    const explain = Object.keys(WEIGHTS).map(key => {
        const weightShare = measured[key] && measuredWeight ? WEIGHTS[key] / measuredWeight : 0;
        return {
            key,
            label: labels[key],
            weight: Math.round(weightShare * 100),
            score: measured[key] ? Math.round(scores[key] || 0) : null,
            points: Math.round((measured[key] ? (scores[key] || 0) * weightShare : 0) * 10) / 10,
            measured: measured[key],
            note: measured[key] ? notes[key] : `${results[key]?.reason || 'Not measured'} It is left out of the score.`
        };
    });

    return {
        score: Math.round(totalScore),
        grade: totalScore >= 90 ? 'A' : totalScore >= 80 ? 'B' : totalScore >= 60 ? 'C' : totalScore >= 40 ? 'D' : 'E',
        breakdown: scores,
        measuredChecks: measuredKeys.length,
        totalChecks: Object.keys(WEIGHTS).length,
        explain
    };
}

/**
 * Run full health scan (all scanners in parallel)
 */
async function runFullScan(onLog, root = PROJECT_ROOT) {
    const startTime = Date.now();

    console.log('[Health Scanner] Starting full scan...');
    if (onLog) onLog('[Health Scanner] Starting full scan...\n');

    // Run all scanners in parallel using Promise.allSettled
    const [
        typescript,
        eslint,
        deadCode,
        audit,
        outdated,
        bundleSize,
        coverage,
        buildStatus
    ] = await Promise.allSettled([
        scanTypeScript(onLog, root),
        scanESLint(onLog, root),
        scanDeadCode(onLog, root),
        scanAudit(onLog, root),
        scanOutdated(onLog, root),
        scanBundleSize(onLog, root),
        scanCoverage(onLog, root),
        scanBuildStatus(onLog, root)
    ]);

    // Extract results, handling any rejected promises
    const results = {
        typescript: typescript.status === 'fulfilled' ? typescript.value : notMeasured(`The check crashed: ${typescript.reason?.message}`),
        eslint: eslint.status === 'fulfilled' ? eslint.value : notMeasured(`The check crashed: ${eslint.reason?.message}`),
        deadCode: deadCode.status === 'fulfilled' ? deadCode.value : notMeasured(`The check crashed: ${deadCode.reason?.message}`),
        audit: audit.status === 'fulfilled' ? audit.value : notMeasured(`The check crashed: ${audit.reason?.message}`),
        outdated: outdated.status === 'fulfilled' ? outdated.value : notMeasured(`The check crashed: ${outdated.reason?.message}`),
        bundleSize: bundleSize.status === 'fulfilled' ? bundleSize.value : notMeasured(`The check crashed: ${bundleSize.reason?.message}`),
        coverage: coverage.status === 'fulfilled' ? coverage.value : notMeasured(`The check crashed: ${coverage.reason?.message}`),
        buildStatus: buildStatus.status === 'fulfilled' ? buildStatus.value : notMeasured(`The check crashed: ${buildStatus.reason?.message}`)
    };

    // Calculate overall health score
    const health = calculateHealthScore(results);

    const duration = Date.now() - startTime;
    console.log(`[Health Scanner] Scan completed in ${duration}ms`);
    if (onLog) onLog(`[Health Scanner] Scan completed in ${duration}ms\n`);

    return {
        timestamp: new Date().toISOString(),
        duration,
        health,
        results
    };
}

/**
 * Run quick scan (TypeScript + ESLint only)
 */
async function runQuickScan(root = PROJECT_ROOT) {
    const startTime = Date.now();

    console.log('[Health Scanner] Starting quick scan...');

    const [typescript, eslint] = await Promise.allSettled([
        scanTypeScript(undefined, root),
        scanESLint(undefined, root)
    ]);

    const results = {
        typescript: typescript.status === 'fulfilled' ? typescript.value : notMeasured(`The check crashed: ${typescript.reason?.message}`),
        eslint: eslint.status === 'fulfilled' ? eslint.value : notMeasured(`The check crashed: ${eslint.reason?.message}`)
    };

    const duration = Date.now() - startTime;
    console.log(`[Health Scanner] Quick scan completed in ${duration}ms`);

    return {
        timestamp: new Date().toISOString(),
        duration,
        type: 'quick',
        results
    };
}

/**
 * Generate AI-friendly markdown report from scan results
 * This report is structured for AI agents to understand and fix issues
 */
function generateReport(scanData, options = {}) {
    const { excludeArchive = true } = options;
    const results = scanData.results || {};
    const health = scanData.health || {};

    let report = `# Codebase Health Report

**Generated**: ${scanData.timestamp || new Date().toISOString()}
**Health Score**: ${health.score || 0}/100 (Grade ${health.grade || 'N/A'})

---

## Summary

| Metric | Status | Count |
|--------|--------|-------|
| TypeScript Errors | ${results.typescript?.status || 'N/A'} | ${results.typescript?.count || 0} |
| ESLint Issues | ${results.eslint?.status || 'N/A'} | ${results.eslint?.errors || 0} errors, ${results.eslint?.warnings || 0} warnings |
| Dead Code Files | ${results.deadCode?.status || 'N/A'} | ${results.deadCode?.files || 0} files |
| Security Vulnerabilities | ${results.audit?.status || 'N/A'} | ${results.audit?.total || 0} total |
| Outdated Dependencies | ${results.outdated?.status || 'N/A'} | ${results.outdated?.count || 0} packages |

---

`;

    // TypeScript Errors Section
    if (results.typescript?.count > 0) {
        let tsErrors = results.typescript.errors || [];

        // Filter out archive files if requested
        if (excludeArchive) {
            tsErrors = tsErrors.filter(e => !e.file?.includes('/archive/'));
        }

        if (tsErrors.length > 0) {
            report += `## TypeScript Errors (${tsErrors.length} issues)

**Instructions for AI Agent**: Fix each TypeScript error below. The errors are grouped by file for easier navigation.

`;
            // Group by file
            const byFile = {};
            for (const err of tsErrors) {
                const file = err.file || 'unknown';
                if (!byFile[file]) byFile[file] = [];
                byFile[file].push(err);
            }

            for (const [file, errors] of Object.entries(byFile)) {
                report += `### \`${file}\`

`;
                for (const err of errors) {
                    report += `- **Line ${err.line}**: ${err.code} - ${err.message}
`;
                }
                report += '\n';
            }
        }
    }

    // ESLint Errors Section
    if (results.eslint?.errors > 0 || results.eslint?.warnings > 0) {
        const files = results.eslint.files || [];

        if (files.length > 0) {
            report += `## ESLint Issues (${results.eslint.errors} errors, ${results.eslint.warnings} warnings)

**Instructions for AI Agent**: Fix ESLint issues. Prioritize errors over warnings. ${results.eslint.fixable > 0 ? `Note: ${results.eslint.fixable} issues are auto-fixable with \`npx eslint --fix\`.` : ''}

`;
            for (const file of files) {
                if (excludeArchive && file.file?.includes('/archive/')) continue;

                report += `### \`${file.file}\`

`;
                for (const msg of file.messages || []) {
                    const icon = msg.severity === 'error' ? '[ERROR]' : '[WARN]';
                    report += `- ${icon} Line ${msg.line}: ${msg.message} (${msg.ruleId})
`;
                }
                report += '\n';
            }
        }
    }

    // Dead Code Section
    if (results.deadCode?.files > 0) {
        report += `## Dead Code (${results.deadCode.files} unused files)

**Instructions for AI Agent**: Review these files. If truly unused, they can be safely deleted. If they should be used, add proper imports/exports.

### Unused Files
`;
        for (const file of results.deadCode.unusedFiles || []) {
            if (excludeArchive && file?.includes('/archive/')) continue;
            report += `- \`${file}\`
`;
        }

        if (results.deadCode.unusedDeps?.length > 0) {
            report += `
### Unused Dependencies
`;
            for (const dep of results.deadCode.unusedDeps) {
                report += `- \`${dep}\`
`;
            }
        }
        report += '\n';
    }

    // Security Vulnerabilities Section
    if (results.audit?.total > 0) {
        report += `## Security Vulnerabilities (${results.audit.total} issues)

**Instructions for AI Agent**: Run \`npm audit fix\` to auto-fix. For breaking changes, run \`npm audit fix --force\` or manually update packages.

| Severity | Count |
|----------|-------|
| Critical | ${results.audit.critical || 0} |
| High | ${results.audit.high || 0} |
| Moderate | ${results.audit.moderate || 0} |
| Low | ${results.audit.low || 0} |

`;
    }

    // Outdated Dependencies Section
    if (results.outdated?.count > 0) {
        report += `## Outdated Dependencies (${results.outdated.count} packages)

**Instructions for AI Agent**: Update packages carefully. Test after each major version bump.

| Package | Current | Latest | Action |
|---------|---------|--------|--------|
`;
        for (const pkg of results.outdated.packages || []) {
            const isMajor = pkg.current?.split('.')[0] !== pkg.latest?.split('.')[0];
            const action = isMajor ? 'Major update - review changelog' : 'Safe to update';
            report += `| ${pkg.name} | ${pkg.current} | ${pkg.latest} | ${action} |
`;
        }
        report += '\n';
    }

    // Action Items Section
    report += `---

## Recommended Fix Order

1. **Critical Security** - Fix any critical/high vulnerabilities first
2. **TypeScript Errors** - These block compilation
3. **ESLint Errors** - Code quality issues that may cause bugs
4. **Dead Code** - Clean up unused files to reduce maintenance burden
5. **Outdated Deps** - Update dependencies for security and features

---

## Quick Fix Commands

\`\`\`bash
# Auto-fix ESLint issues
npx eslint src --fix

# Fix security vulnerabilities
npm audit fix

# Update all dependencies (careful!)
npm update

# Check for TypeScript errors
npx vue-tsc --noEmit
\`\`\`
`;

    return report;
}

// Export scanner functions
module.exports = {
    notMeasured,
    toolDidNotRun,
    runFullScan,
    runQuickScan,
    scanTypeScript,
    scanESLint,
    scanDeadCode,
    scanAudit,
    scanOutdated,
    scanBundleSize,
    scanCoverage,
    scanBuildStatus,
    calculateHealthScore,
    generateReport
};

// CLI support
if (require.main === module) {
    const arg = process.argv[2];

    if (arg === 'quick') {
        runQuickScan().then(result => {
            console.log(JSON.stringify(result, null, 2));
        });
    } else if (arg === 'report') {
        // Generate AI-friendly markdown report
        console.error('[Health Scanner] Running full scan for report...');
        runFullScan().then(result => {
            const report = generateReport(result, { excludeArchive: true });
            console.log(report);
        });
    } else if (arg === 'report-all') {
        // Generate report including archived files
        console.error('[Health Scanner] Running full scan for report (including archive)...');
        runFullScan().then(result => {
            const report = generateReport(result, { excludeArchive: false });
            console.log(report);
        });
    } else {
        runFullScan().then(result => {
            console.log(JSON.stringify(result, null, 2));
        });
    }
}
