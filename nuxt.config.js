module.exports = {
  head: {
    title: 'e-Chauffeur - Dashboard',
    link: [
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' },
    ],
  },

  router: {
    middleware: ['auth'],
  },

  build: {
    parallel: true,
    transpile: ['@qonfucius/vue-cal'],
  },

  css: [
    { src: '~assets/css/main.scss', lang: 'scss' },
  ],
  plugins: [
    { src: '~/plugins/multiselect.js', mode: 'client' },
    '~/plugins/context.js',
    { src: '~/plugins/datetime-picker.js', mode: 'client' },
    { src: '~/plugins/vuecal.js', mode: 'client' },
    { src: '~/plugins/realtime.js', mode: 'client' },
  ],

  modules: [
    'nuxt-leaflet',
    [
      '@fabnumdef/e-chauffeur_lib-vue',
      {
        components: {},
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
          campusUsers: 'campus-users',
        },
        withAuth: true,
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
          'faMap',
          'faMapMarkerAlt',
          'faFlag',
          'faEdit',
          'faTrash',
          'faPlus',
          'faSave',
          'faTimes',
          'faCalendar',
          'faUser',
          'faArrowRight',
          'faKey',
          'faAngleDown',
          'faCalendarAlt',
          'faChevronRight',
          'faFileExport',
          'faCommentDots',
          'faExternalLinkAlt',
          'faChevronLeft',
          'faUserCircle',
          'faCog',
          'faSpinner',
          'faList',
          'faChartPie',
          'faChartBar',
          'faWindowMinimize',
          'faExclamationTriangle',
          'faMapPin',
          'faCar',
          'faCheckCircle',
          'faTimesCircle',
          'faFileImport',
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
