<script setup>
  import { computed, ref, onMounted } from 'vue'
  import { dashSettings } from '@/stores/dashSettings'

  // https://console.cloud.google.com/apis/credentials/consent?project=delivery-app-1104
  // https://console.cloud.google.com/apis/credentials?project=delivery-app-1104
  // https://www.youtube.com/watch?v=bOd4eFqIg00&ab_channel=CodingShiksha

  const settings = dashSettings()

  onMounted(() => {
    let params = {}
    let regex = /([^&=]+)=([^&]*)/g, m

    while(m = regex.exec(location.href)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2])
    }

    if(Object.keys(params).length > 0) {
      console.log( JSON.stringify(params))
      localStorage.setItem('authInfo', JSON.stringify(params))
    }


    window.history.pushState({}, document.title, '/')
    settings.setAuthInfo(JSON.parse(localStorage.getItem('authInfo')))
    // console.log(JSON.parse(localStorage.getItem('authInfo')))
    // console.log(authInfo.value['access_token'])
    // console.log(authInfo.value['expires_in'])

    getUserInfo()
  })

  const getUserInfo = () => {
    fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    // fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      headers: {
        'Authorization': `Bearer ${ settings.authInfo['access_token'] }`
      }
    })
    .then((data) => data.json())
    .then((response) => {
      if (!!response.error) {
        settings.logOut()
        } else {
        settings.setUserInfo(response)
        settings.login()
      }
    })
  }
</script>
