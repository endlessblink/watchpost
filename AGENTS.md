# Watchpost Agent Instructions

Read `CLAUDE.md` before modifying this repository. It documents the application,
API surface, and the current network/VPS operating contract.

## Security-Critical Contract

- Keep Watchpost bound to `127.0.0.1:6010` by default.
- Do not expose Watchpost directly on `0.0.0.0` or the workstation LAN address.
- Remote access is private Tailnet access through:
  `https://endlessblink.tail07658e.ts.net:6010`
- Manage it only with:

  ```bash
  watchpost remote enable
  watchpost remote disable
  watchpost remote status
  ```

- Use Tailscale Serve, never Funnel, for Watchpost.
- Do not reset or alter the existing Funnel on HTTPS 443; it proxies localhost
  port 9544 for a separate service.

## Mandatory VPS Capability

Watchpost must continue connecting outbound from this PC to the VPS over SSH and
mapping all registered plus auto-discovered Docker/systemd services.

Do not ship a networking or authentication change unless all of these remain true:

1. Local `GET /api/status` returns HTTP 200.
2. Direct LAN access to port 6010 is blocked.
3. Private Tailscale access works when enabled.
4. `GET /api/vps/status` returns resources and services with `sshError: null`.
5. VPS logs, restart, and update API routes remain mounted.

The live baseline recorded on 2026-06-15 was 23 mapped VPS services.

## Verification

Use the same Node runtime as the systemd service:

```bash
/usr/bin/node node_modules/vitest/vitest.mjs run
bash -n watchpost
```

The security/network regression tests are:

- `tests/unit/network-access.test.js`
- `tests/unit/remote-access-cli.test.js`
- `tests/unit/vps-mapping-regression.test.js`

Verify the live service after a restart:

```bash
systemctl --user is-active watchpost.service
ss -ltnp 'sport = :6010'
curl -sS http://127.0.0.1:6010/api/status
curl -sS http://127.0.0.1:6010/api/vps/status
tailscale serve status
```

## Worktree Safety

The worktree may already contain unrelated user changes, especially in
`projects.json`, `server.js`, `.watchpost/`, and restart logs. Preserve them.
Do not reset, clean, or broadly rewrite the worktree.
