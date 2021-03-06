import { AUTH_HEADER_KEY } from '@fabnumdef/e-chauffeur_lib-vue/plugins/socket';

export default function ({ store, app }) {
  const ioInstance = app.$io;
  const watched = [];
  if (ioInstance) {
    ioInstance.on('connect', () => {
      const init = async function init(campus) {
        if (campus) {
          await store.dispatch('realtime/fetchDrivers', campus);
          ioInstance.emit('roomLeaveAll');
          ioInstance.emit('roomJoinAdmin', app.$auth.$storage.getUniversal(AUTH_HEADER_KEY), campus);
        }
      };
      init(store.getters['context/campus']);
      watched.push(store.watch((state, getters) => getters['context/campus'], init));
      store.dispatch('reconnecting', false);
    });
    ioInstance.on('reconnecting', () => {
      store.dispatch('reconnecting', true);
    });
    ioInstance.on('disconnect', () => {
      store.dispatch('reconnecting', true);
      watched.forEach((unwatch) => unwatch());
    });
    ioInstance.on('updateConnectedDrivers', ({ ids, connected = true }) => {
      const concatIds = [].concat(ids);
      store.dispatch('updateConnectedDrivers', { ids: concatIds, connected });
    });

    const autoConnect = (isLogged) => {
      if (isLogged) {
        ioInstance.open();
      } else {
        ioInstance.close();
      }
    };
    autoConnect(app.$auth.loggedIn);
    app.$auth.$storage.watchState('loggedIn', autoConnect);
  }
}
