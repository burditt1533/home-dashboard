<script setup>
import { computed, ref, onMounted } from 'vue'
import Sidebar from 'primevue/sidebar'
import Login from '../components/Login.vue'
import LoginActions from '../components/LoginActions.vue'

// import { RouterLink } from 'vue-router'
const isSidebarOpen = ref(false)

const handleClick = () => {
  isSidebarOpen.value = true
}

const menuIconClass = computed(() => {
  return isSidebarOpen.value ? 'ri-close-large-line' : 'ri-menu-line'
})

onMounted(async () => {})
</script>

<template>
  <div class="wifi-container">
    <div class="wifi-left">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
        alt="qr code"
        class="wifi-qr"
      />
      <h4>Scan with your phone</h4>
    </div>
    <div class="wifi-right">
      <h1 class="wifi-header">Wifi <i class="ri-wifi-line" /></h1>

      <div class="wifi-info">
        <h4 class='wifi-title'>Network:</h4>
        <div class="wifi-textbox">TheBurdnest</div>
      </div>
      <div class="wifi-info">
        <h4 class='wifi-title'>Password:</h4>
        <div class="wifi-textbox">09171810#</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wifi-container {
  width: 100%;
  background: $dash-c-card-bg;
  color: $dash-c-white;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;

  .wifi-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 40%;

    .wifi-qr {
      background: $dash-c-white;
      border-radius: 4px;
      width: 40%;
      margin-bottom: 12px;
    }
  }

  .wifi-right {
    width: 30%;

    .wifi-header {
      margin-bottom: 20px;
    }

    .wifi-info {
      margin-bottom: 13px;
      display: flex;
      font-size: 20px;
      .wifi-title {
        margin: 0;
      }
      .wifi-textbox {
        padding-left: 10px;
      }
    }
  }

  @media(max-width: 500px) {
    flex-direction: column;

    .wifi-left, .wifi-right {
      width: 100%;
    }

    .wifi-header {
      text-align: center;
    }

    .wifi-info {
      justify-content: center;
    }
  }
}
</style>
