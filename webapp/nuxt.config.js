export default {
  mode: 'spa',
  /*
   ** Headers of the page

    <meta name="" content="yes">
    <meta name="" content="black">
    <meta name="" content="Skyline&trade; Console">
    <meta name="msapplication-TileImage" content="">


   */

  head: {
    title: 'Pandemic Simulation',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes'
      },
      {
        name: 'apple-mobile-web-app-status-bar-style',
        content: 'black'
      },
      {
        name: 'apple-mobile-web-app-title',
        content: 'Pandemic Simulation'
      },
      {
        name: 'msapplication-TileImage',
        content: 'ms-icon-144x144.png'
      },
      { name: 'msapplication-TileColor', content: '#000000' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: 'favicon-16x16.png'
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: 'favicon-32x32.png'
      },
      {
        rel: 'apple-touch-icon',
        type: 'image/x-icon',
        href: 'apple-icon-152x152.png'
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://unpkg.com/leaflet@1.6.0/dist/leaflet.css'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-69636997-11'
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
  }
}
