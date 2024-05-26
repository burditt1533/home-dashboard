<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Sidebar from 'primevue/sidebar'
import Login from '../components/Login.vue'
import LoginActions from '../components/LoginActions.vue'

const isSidebarOpen = ref(false)
const navLinks = ref([
  { label: 'Guest View', icon: 'ri-close-large-line', route: '/guest'}
])

const handleClick = () => {
  isSidebarOpen.value = true
}

const menuIconClass = computed(() => {
  return isSidebarOpen.value ? 'ri-close-large-line' : 'ri-menu-line'
})

onMounted(async () => {})
</script>

<template>
  <div class="header-container">
    <div class="menu-button" @click="handleClick">
      <i :class="menuIconClass"></i>
    </div>

    <Sidebar
      v-model:visible="isSidebarOpen"
      @show="'updateSideCalendar'"
      :style="{ width: '30vw' }"
      :showCloseIcon="false"
    >
      <Login />
      <div class="side-nav-container">
        <template v-for='link in navLinks' :key='link.label'>
          <RouterLink :to="link.route" class="side-nav-link">
            <i :class="['side-nav-icon', link.icon]"></i>
            <h4 class='side-nav-label'>{{ link.label }}</h4>
          </RouterLink>
        </template>
      </div>
    </Sidebar>
    <LoginActions />
  </div>
</template>

<style scoped lang="scss">
.header-container {
  color: $dash-c-white;
  height: 70px;
  width: 70px;
  z-index: 100;
  position: fixed;
  top: 0;
  right: 0;
  background: $dash-c-card-bg;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 20px;
  cursor: pointer;

  .menu-button {
    font-size: 40px;
    // padding: 20px;
  }
}

.side-nav-container {
  display: flex;
  flex-direction: column;

  .side-nav-link {
    width: 100%;
    // padding: 20px;
    background: $dash-c-white;
    display: flex;
    align-content: center;

    .side-nav-icon {
      padding: 20px;
    }

    .side-nav-label {
      padding: 20px;
    }
  }
}
</style>
