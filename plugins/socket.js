import { AUTH_HEADER_KEY } from '@fabnumdef/e-chauffeur_lib-vue/plugins/socket';

export default function ({ store, app }) {
  const ioInstance = app.$io;
  const watched = [];
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
  });
  ioInstance.on('disconnect', () => {
    watched.forEach((unwatch) => unwatch());
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
