// import *  as GetApiCall  from './bd/System'
import * as json from './bd/data.json'

export default {
  install: function (Vue) {
    Vue.prototype.$AppTitle = () => {
      return json.app.app.title
    }

    Vue.prototype.$AppTheme = () => {
      return json.app.theme
    }

    Vue.prototype.$AppBtn = (btn) => {
      let txt = 'Error'
      for (var i = 0; i < json.app.buttons.length; i++) {
        if (json.app.buttons[i].name === btn) {
          txt = json.app.buttons[i]
        }
      }

      return txt
    }

    Vue.prototype.$AppRoute = (route) => {
      let params = 'Error'
      for (var i = 0; i < json.app.routes.length; i++) {
        if (json.app.routes[i].name === route) {
          params = json.app.routes[i]
        }
      }
      return params
    }

    // Vue.prototype.$refreshToken = () => {
    //  return Vue.prototype.$getGapiClient().then(refreshToken)
    // }

    // Vue.prototype.$logout = () => {
    //  return Vue.prototype.$getGapiClient().then(logout)
    // }

    // Vue.prototype.$isAuthenticated = isAuthenticated

    // Vue.prototype.$getUserData = getUserData
  },
  AppTheme: function () {
    return 's'// json.app.theme
  }

}
