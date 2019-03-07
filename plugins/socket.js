import Vue from 'vue';
import VueSocketio from 'vue-socket.io-extended';
import io from 'socket.io-client';

const authHeaderKey = '_token.local';

export default function ({ env, store, app }, inject) {
  const ioInstance = io(env.apiUrl, { autoConnect: false });
  Vue.use(VueSocketio, ioInstance, { store });
  inject('io', ioInstance);
  const watched = [];
  ioInstance.on('connect', () => {
    const init = async function init(campus) {
      if (campus) {
        await store.dispatch('realtime/fetchDrivers', campus);
        app.$io.emit('roomLeaveAll');
        app.$io.emit('roomJoinAdmin', app.$auth.$storage.getUniversal(authHeaderKey), campus);
      }
    };
    init(store.getters['context/campus']);
    watched.push(store.watch((state, getters) => getters['context/campus'], init));
  });
  ioInstance.on('disconnect', () => {
    watched.forEach(cb => cb());
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
