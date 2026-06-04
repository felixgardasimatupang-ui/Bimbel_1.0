import { permissionCatalog, roles, type PermissionKey, type RoleCode } from '@/server/catalog';

export function getRole(roleCode: RoleCode) {
  return roles.find((role) => role.code === roleCode);
}

export function getPermissionsForRoleCodes(roleCodes: RoleCode[]) {
  const permissionSet = new Set<PermissionKey>();

  for (const roleCode of roleCodes) {
    const role = getRole(roleCode);

    if (!role) {
      continue;
    }

    for (const permission of role.permissions) {
      permissionSet.add(permission);
    }
  }

  return Array.from(permissionSet).sort();
}

export function hasPermission(roleCodes: RoleCode[], permission: PermissionKey) {
  return getPermissionsForRoleCodes(roleCodes).includes(permission);
}

export function listAllPermissions() {
  return [...permissionCatalog];
}
