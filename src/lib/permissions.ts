export type UserRole = "main_admin" | "parallel_admin" | "student";

export const RolePermissions = {
  main_admin: {
    canCreateFarewell: true,
    canManageFarewell: true,
    canPostAnnouncement: true,
    canDeleteAnnouncement: true,
    canAssignDuties: true,
    canApproveSubmissions: true,
  },
  parallel_admin: {
    canCreateFarewell: false,
    canManageFarewell: false,
    canPostAnnouncement: true,
    canDeleteAnnouncement: false,
    canAssignDuties: false,
    canApproveSubmissions: true,
  },
  student: {
    canCreateFarewell: false,
    canManageFarewell: false,
    canPostAnnouncement: false,
    canDeleteAnnouncement: false,
    canAssignDuties: false,
    canApproveSubmissions: false,
  },
} as const;

type RoleMap = typeof RolePermissions;
export type PermissionKey = keyof RoleMap["main_admin"];

/** Check a single permission safely. */
export function can(role: UserRole, permission: PermissionKey): boolean {
  return RolePermissions[role][permission];
}
