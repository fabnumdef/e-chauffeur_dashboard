const { version } = require('./package.json');

function addNewToRoutes(routes, prepend, name) {
  const routeParent = routes.find((r) => r.name === `${prepend}${name}-id`);
  if (!routeParent) {
    return;
  }
  const routeEdit = routeParent.children.find((r) => r.name === `${prepend}${name}-id-edit`);
  if (!routeEdit) {
    return;
  }
  routes.unshift({
    name: `${prepend}${name}-new`,
    path: prepend ? `${name}/new` : `/${name}/new`,
    component: routeEdit.component,
    chunkName: routeEdit.chunkName,
  });
}

module.exports = {
  head: {
    title: 'Dashboard',
    titleTemplate: 'e-Chauffeur - %s',
    link: [
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' },
    ],
  },

  router: {
    middleware: ['auth', 'meta'],
    extendRoutes(routes) {
      const autoNewRoot = ['campuses', 'car-models', 'categories', 'phone-models', 'users'];
      autoNewRoot.forEach(addNewToRoutes.bind(this, routes, ''));
      const autoNewCampus = ['cars', 'drivers', 'phones', 'pois', 'users', 'shuttle-factories'];
      autoNewCampus.forEach(addNewToRoutes.bind(this, routes.find((r) => r.path === '/:campus').children, 'campus-'));
    },
  },

  build: {
    transpile: ['@qonfucius/vue-cal'],
  },

  css: [
    { src: '~assets/css/main.scss', lang: 'scss' },
  ],
  plugins: [
    '~/plugins/components.js',
    { src: '~/plugins/custom-toasted.js', mode: 'client' },
    { src: '~/plugins/multiselect.js', mode: 'client' },
    '~/plugins/context.js',
    { src: '~/plugins/datetime-picker.js', mode: 'client' },
    { src: '~/plugins/vuecal.js' },
    { src: '~/plugins/realtime.js', mode: 'client' },
    { src: '~/plugins/draggable.js', mode: 'client' },
  ],
  env: {
    version,
  },
  modules: [
    'nuxt-leaflet',
    [
      '@fabnumdef/e-chauffeur_lib-vue',
      {
        api: {
          campuses: 'campuses',
          carModels: 'car-models',
          timeSlot: 'time-slots',
          cars: 'cars',
          categories: 'categories',
          feedback: 'feedback',
          jwt: 'jwt',
          logs: 'logs',
          pois: 'pois',
          rides: 'rides',
          users: 'users',
          drivers: 'drivers',
          phones: 'phones',
          phoneModels: 'phone-models',
          ratings: 'ratings',
          shuttleFactories: 'shuttle-factories',
          shuttles: 'shuttles',
        },
        authPlugins: [
          { src: 'has-right' },
          { src: 'auth-renew', mode: 'client' },
          { src: 'user-expiration', mode: 'client' },
        ],
        prometheus: {
          port: process.env.PROMETHEUS_EXPORTER || 9091,
          host: '0.0.0.0',
        },
      },
    ],
  ],

  auth: {
    plugins: [
      {
        src: '~/plugins/socket.js',
        mode: 'client',
      },
    ],
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/',
    },
  },

  fontAwesome: {
    packs: [
      {
        package: '@fortawesome/free-solid-svg-icons',
        icons: [
          // Sorted alphabetically
          'faAngleDown',
          'faAngleUp',
          'faArrowDown',
          'faArrowRight',
          'faArrowUp',
          'faBus',
          'faCalendar',
          'faCalendarAlt',
          'faCar',
          'faChartBar',
          'faChartPie',
          'faCheckCircle',
          'faChevronLeft',
          'faChevronRight',
          'faCog',
          'faCommentDots',
          'faEdit',
          'faExclamationTriangle',
          'faExternalLinkAlt',
          'faFileExport',
          'faFileImport',
          'faFlag',
          'faKey',
          'faList',
          'faMap',
          'faMapMarkerAlt',
          'faMapPin',
          'faPlus',
          'faRedo',
          'faSave',
          'faSearch',
          'faSpinner',
          'faTimes',
          'faTimesCircle',
          'faTrash',
          'faUser',
          'faUserCircle',
          'faWindowMinimize',
        ],
      },
    ],
  },

  manifest: {
    name: 'e-Chauffeur - Régulateur',
    short_name: 'e-Chauffeur',
    description: 'Application régulateur',
  },
  server: {
    host: '0.0.0.0',
  },
};
