import * as roles from '../api/roles';

const rolesKeys = {
  ...Object.keys(roles)
    .map(r => ({ [r]: r }))
    .reduce((acc, r) => Object.assign(acc, r), {}),
};

export default function ({ app }) {
  Object.assign(app.$auth, {
    hasRole(role, campus) {
      if (!this.user || !this.user.roles) {
        return false;
      }
      return this.user.roles.find(
        rule => roles[rule.role].includes(role) && (!campus || rule.campuses.includes(campus)),
      );
    },
    isRegulator(...params) {
      return this.hasRole(rolesKeys.ROLE_REGULATOR, ...params);
    },
    isAdmin(...params) {
      return this.hasRole(rolesKeys.ROLE_ADMIN, ...params);
    },
    isSuperAdmin(...params) {
      return this.hasRole(rolesKeys.ROLE_SUPERADMIN, ...params);
    },
  });
}
