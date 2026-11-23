import { useAccessStore } from '@vben/stores';

/**
 * Builds ZIM admin headers from the current GoWind permission codes.
 * The wildcard is never sent; ZIM enforces the per-route permission.
 */
export function zimHeaders(): Record<string, string> {
  const codes = useAccessStore().accessCodes ?? [];
  const permissions = codes.filter((code) => code.startsWith('zim:'));
  return {
    'Content-Type': 'application/json',
    'X-ZIM-Admin-Permissions': permissions.join(','),
    'X-ZIM-Admin-Source': 'zim-admin',
    'X-ZIM-Admin-Token': import.meta.env.VITE_ZIM_ADMIN_TOKEN || 'dev-admin-token',
  };
}
