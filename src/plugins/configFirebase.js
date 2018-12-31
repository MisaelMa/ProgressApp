/* eslint-disable indent */
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/messaging'

const config = {
  apiKey: 'AIzaSyDZ4nOrGusnGciCyzQ_KFJyhfz427wqKvY',
  authDomain: 'my-project-1535646339696.firebaseapp.com',
  databaseURL: 'https://my-project-1535646339696.firebaseio.com',
  projectId: 'my-project-1535646339696',
  storageBucket: 'my-project-1535646339696.appspot.com',
  messagingSenderId: '242604457386'
}

firebase.initializeApp(config)

// Initialize Cloud Firestore through Firebase
let db = firebase.firestore()

// Disable deprecated features
db.settings({
  timestampsInSnapshots: true
})

export default {
    install: function (Vue) {
        Vue.prototype.$db = db
    }
}
