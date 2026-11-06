'use strict';

const DEFAULT_BIND_HOST = '127.0.0.1';

function resolveBindHost({ env = process.env, localConfig = {} } = {}) {
    const configuredHost = env.WATCHPOST_HOST || localConfig.host;

    if (typeof configuredHost !== 'string' || configuredHost.trim() === '') {
        return DEFAULT_BIND_HOST;
    }

    return configuredHost.trim();
}

module.exports = {
    DEFAULT_BIND_HOST,
    resolveBindHost
};
