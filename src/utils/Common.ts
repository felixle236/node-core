import { RoleId } from 'domain/enums/user/RoleId';

/**
 * Generate authentication required for API documentation.
 */
export function generateAuthRequiredDoc(...roleIds: RoleId[]): string {
  if (!roleIds.length) {
    return 'Authentication required';
  }

  const roleKeys = Object.keys(RoleId);
  const list = roleIds.map((roleId) => roleKeys.find((roleKey) => RoleId[roleKey] === roleId));

  return `Role required: ${list.join(', ')}`;
}
