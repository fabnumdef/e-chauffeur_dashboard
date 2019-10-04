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
    '~/plugins/multiselect.js',
    '~/plugins/context.js',
    { src: '~/plugins/datetime-picker.js', ssr: false },
    { src: '~/plugins/vuecal.js', ssr: true },
    '~/plugins/realtime.js',
  ],

  modules: [
    'nuxt-leaflet',
    [
      '@fabnumdef/e-chauffeur_lib-vue',
      {
        components: {},
        api: {
          campuses: 'campuses',
          carEvents: 'car-events',
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
        },
        withAuth: true,
        authPlugins: [
          'has-right',
          'auth-renew',
        ],
      },
    ],
  ],

  auth: {
    plugins: [
      '~/plugins/socket.js',
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
