module.exports = {
  mode: 'spa',

  head: {
    title: 'e-Chauffeur - Dashboard',
    htmlAttrs: {
      lang: 'fr',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    ],
    link: [
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Source+Sans+Pro:400,700' },
    ],
  },

  router: {
    middleware: ['auth'],
  },

  loading: { color: '#fff' },

  css: [
    { src: '~assets/css/main.scss', lang: 'scss' },
  ],

  plugins: [
    '~/api',
    '~/plugins/multiselect.js',
    '~/plugins/context.js',
    '~/plugins/datetime-picker.js',
    '~/plugins/realtime.js',
  ],

  modules: [
    'nuxt-leaflet',
    '@nuxtjs/auth',
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
        },
        plugins: [
          'has-right',
        ],
      },
    ],
  ],

  auth: {
    plugins: [
      '~/plugins/auth-renew.js',
      '~/plugins/socket.js',
    ],
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/',
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/jwt/generate?mask=token', method: 'post', propertyName: 'token' },
          user: { url: '/jwt/user?mask=id,email,roles', method: 'get', propertyName: false },
          logout: null,
        },
      },
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
        ],
      },
    ],
  },

  env: {
    apiUrl: process.env.API_URL,
  },

  toast: {
    position: 'bottom-right',
    duration: 15000,
  },

  manifest: {
    name: 'e-Chauffeur - Régulateur',
    short_name: 'e-Chauffeur',
    description: 'Application régulateur',
    lang: 'fr',
  },
};
