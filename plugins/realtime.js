export default function ({ store }) {
  const init = async function init(campus) {
    if (campus) {
      await store.dispatch('realtime/fetchDrivers', campus);
    }
  };
  init(store.getters['context/campus']);
  store.watch((state, getters) => getters['context/campus'], init);
}
