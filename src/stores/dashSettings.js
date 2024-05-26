import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const dashSettings = defineStore('dashSettings', {
  state: () => ({
    isLoggedIn: false,
    authInfo: {

    },
    userInfo: {},
    calendarEvents: []
  }),
  getters: {
    // doubleCount: (state) => state.count * 2,
  },
  actions: {
    login() {
      this.isLoggedIn = true
    },
    logOut() {
      this.isLoggedIn = false
    },
    setAuthInfo (info) {
      if (!!info) {
        this.authInfo = info
      } 
    },
    setUserInfo (info) {
      this.userInfo = info
    }
  },
})