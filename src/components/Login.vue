<script setup>
  import { computed, ref, onMounted } from 'vue'
  import { dashSettings } from '@/stores/dashSettings'

  // https://console.cloud.google.com/apis/credentials/consent?project=delivery-app-1104
  // https://console.cloud.google.com/apis/credentials?project=delivery-app-1104
  // https://www.youtube.com/watch?v=bOd4eFqIg00&ab_channel=CodingShiksha

  const settings = dashSettings()

  const login =  () => {
    let oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'

    let form = document.createElement('form')
    form.setAttribute('method', 'GET')
    form.setAttribute('action', oauth2Endpoint)

    let params = {
      'client_id': '614084643197-jccf8vb9gcf8kfqcthsr8naa71nbjp65.apps.googleusercontent.com',
      'redirect_uri': '/',
      'response_type': 'token',
      'scope': 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/calendar.readonly',
      'include_granted_scopes': 'true',
      'state': 'pass-through-value'
    }

    for (var p in params) {
      let input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', p)
      input.setAttribute('value', params[p])
      form.appendChild(input)
    }

    document.body.appendChild(form)
    form.submit()
  }

  const logout = () => {
    fetch('https://oauth2.googleapis.com/revoke?token=' + settings['access_token'], {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded'
      }
    })
    .then((data) => {
      location.href = '/'
    })
  }
</script>

<template>
  <div class="login-container">
    <template v-if='settings.isLoggedIn'>
      <h2 id='name'>{{ settings.userInfo.name }}</h2>
      <img id='image' :src='settings.userInfo.picture' />
      <button @click='logout'>logout</button>
    </template>
    <button v-else @click='login'>login</button>
  </div>
</template>

<style scoped lang='scss'>
  .login-container {
    width: 100%;
  }
</style>
