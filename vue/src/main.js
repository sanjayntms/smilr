// Core Vue stuff
import Vue from 'vue'
import App from './App'
import router from './router'

// Bootstrap and theme
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue);
import 'bootswatch/dist/cosmo/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Other plugins
Vue.use(require('vue-moment'))
import VeeValidate from 'vee-validate';
Vue.use(VeeValidate, {fieldsBagName: 'formFields', events: 'change|blur'})

// Font Awesome
import { library as faLibrary } from '@fortawesome/fontawesome-svg-core'
import { faHome, faInfoCircle, faCoffee, faCalendarAlt, faFlask, faChalkboardTeacher, faLaptopCode, 
  faTools, faChartBar, faSync, faEdit, faTrashAlt, 
  faCalendarPlus, faPlusSquare, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
faLibrary.add(faHome) // Add your icons here
faLibrary.add(faInfoCircle)
faLibrary.add(faCoffee)
faLibrary.add(faSync)
faLibrary.add(faCalendarAlt)
faLibrary.add(faFlask)
faLibrary.add(faChalkboardTeacher)
faLibrary.add(faLaptopCode)
faLibrary.add(faTools)
faLibrary.add(faChartBar)
faLibrary.add(faEdit)
faLibrary.add(faTrashAlt)
faLibrary.add(faCalendarPlus)
faLibrary.add(faPlusSquare)
faLibrary.add(faUser)
Vue.component('fa', FontAwesomeIcon)

/* ================================================================================================== */

/* eslint-disable */
Vue.config.productionTip = false

// Global object created and populated here and exported for other code to use
var config = {}
// Global user profile object 
var userProfile = {}

export { userProfile, config }

// In production mode fetch config at runtime from /.config endpoint
// This assumes the SPA is being served by the Smilr frontend Node server
if(process.env.NODE_ENV != 'development') {
  fetch(`/.config/API_ENDPOINT,AAD_CLIENT_ID,ADMIN_USER_LIST`)
  .then(resp => {
    resp.json()
    .then(result => {
      // Store results as our global config object, then init the app
      config.API_ENDPOINT = result.API_ENDPOINT
      config.AAD_CLIENT_ID = result.AAD_CLIENT_ID
      config.ADMIN_USER_LIST = result.ADMIN_USER_LIST
      initApp()
    })
    .catch(err => {
      console.log(`### Unable to fetch config from server. App will not start! Err: ${err}`);
    })
  })
  .catch(err => {
    console.log(`### Unable to fetch config from server. App will not start! Err: ${err}`);
  })
} else {
  // In dev mode fetch config from static .env file, note the VUE_APP_ prefix
  config.API_ENDPOINT = process.env.VUE_APP_API_ENDPOINT
  config.AAD_CLIENT_ID = process.env.VUE_APP_AAD_CLIENT_ID
  config.ADMIN_USER_LIST = process.env.VUE_APP_ADMIN_USER_LIST
  initApp()
}

//
// It all starts here, create the Vue instance and mount the app component
//
function initApp() {
  console.log(`### App starting running in ${process.env.NODE_ENV} mode`)
  console.log('### App config is', config)

  // Check if security enabled
  if(config.AAD_CLIENT_ID) {
    userProfile = {
      user: null
    }
  } else {
    // Already log in as fake admin user, bypassing all auth and login stuff
    userProfile = {
      user: {
        name: '[Auth Disabled]'
      },
      isAdmin: true
    }
  }

  new Vue({
    router,
    render: function (h) { return h(App) },
    beforeCreate: function() { }
  }).$mount('#app')
}


