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
    { src: '~/plugins/realtime.js', ssr: false },
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
          'has-right',
          'auth-renew',
          'user-expiration',
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
          'faMapPin',
          'faCar',
          'faCheckCircle',
          'faTimesCircle',
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
