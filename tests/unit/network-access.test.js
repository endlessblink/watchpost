import { describe, expect, it } from 'vitest';
import networkAccess from '../../modules/network-access.js';

const { DEFAULT_BIND_HOST, resolveBindHost } = networkAccess;

describe('Watchpost network access', () => {
    it('binds to loopback by default', () => {
        expect(DEFAULT_BIND_HOST).toBe('127.0.0.1');
        expect(resolveBindHost({ env: {}, localConfig: {} })).toBe('127.0.0.1');
    });

    it('supports an explicit WATCHPOST_HOST override', () => {
        expect(resolveBindHost({
            env: { WATCHPOST_HOST: '100.123.175.54' },
            localConfig: {}
        })).toBe('100.123.175.54');
    });

    it('uses local config only when the environment does not override it', () => {
        expect(resolveBindHost({
            env: { WATCHPOST_HOST: '127.0.0.1' },
            localConfig: { host: '0.0.0.0' }
        })).toBe('127.0.0.1');

        expect(resolveBindHost({
            env: {},
            localConfig: { host: '100.123.175.54' }
        })).toBe('100.123.175.54');
    });
});
