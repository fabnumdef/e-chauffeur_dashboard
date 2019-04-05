module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
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

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    { src: '~assets/css/main.scss', lang: 'scss' },
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/api',
    '~/plugins/multiselect.js',
    '~/plugins/context.js',
    '~/plugins/datetime-picker.js',
    '~/plugins/luxon.js',
    '~/plugins/realtime.js',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    'nuxt-leaflet',
    '@nuxtjs/auth',
    [
      '@fabnumdef/e-chauffeur_lib-vue',
      {
        components: {},
      },
    ],
    ['qonfucius-nuxt-bulma', { css: false, postcss: false }],
    'qonfucius-nuxt-fontawesome',
  ],

  auth: {
    plugins: [
      '~/plugins/auth-renew.js',
      '~/plugins/socket.js',
      '~/plugins/has-right.js',
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
