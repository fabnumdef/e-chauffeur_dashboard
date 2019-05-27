module.exports = {
  mode: 'spa',

  head: {
    title: 'e-Chauffeur - Dashboard',
    link: [
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' },
    ],
  },

  router: {
    middleware: ['auth'],
  },

  css: [
    { src: '~assets/css/main.scss', lang: 'scss' },
  ],

  plugins: [
    '~/plugins/multiselect.js',
    '~/plugins/context.js',
    '~/plugins/datetime-picker.js',
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
          cars: 'cars',
          categories: 'categories',
          feedback: 'feedback',
          jwt: 'jwt',
          logs: 'logs',
          pois: 'pois',
          rides: 'rides',
          userEvents: 'user-events',
          users: 'users',
          drivers: 'drivers',
          // Todo reactivate this
          // phones: 'phones',
          // phoneModels: 'phone-models',
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
      // Todo if this works with lib, remove
      '~/plugins/auth-renew.js',
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
        ],
      },
    ],
  },

  manifest: {
    name: 'e-Chauffeur - Régulateur',
    short_name: 'e-Chauffeur',
    description: 'Application régulateur',
  },
};
