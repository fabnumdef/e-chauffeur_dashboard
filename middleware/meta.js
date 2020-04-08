export default ({ route, store }) => {
  store.commit('context/setMeta', route.meta.reduce((acc, cur) => Object.assign(acc, cur), {}));
};
