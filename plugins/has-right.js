export default function ({ app }) {
  Object.assign(app.$auth, {
    hasRight(right, campus) {
      if (!this.user || !this.user.cachedRights) {
        return false;
      }
      return this.user.cachedRights.reduce(
        (acc, { rights, campuses }) => acc || (rights.includes(right) && (!campus || campuses.includes(campus))),
        false,
      );
    },
  });
}
