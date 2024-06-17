<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Sidebar from 'primevue/sidebar'
import Login from '../components/Login.vue'
import LoginActions from '../components/LoginActions.vue'

const isSidebarOpen = ref(false)
const navLinks = ref([
  { label: 'Guest', icon: 'ri-group-line', route: '/guest'},
  { label: 'Karaoke', icon: 'ri-mv-line', route: '/karaoke'},
  { label: 'Clean House', icon: 'ri-home-smile-fill', route: '/cleanHouse'},
])

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const menuIconClass = computed(() => {
  return isSidebarOpen.value ? 'ri-close-large-line' : 'ri-menu-line'
})

onMounted(async () => {})
</script>

<template>
  <div class="header-container">
    <div class="menu-button" @click="toggleSidebar">
      <i :class="menuIconClass"></i>
    </div>

    <Sidebar
      v-model:visible="isSidebarOpen"
      @show="'updateSideCalendar'"
      :pt="{
        root: 'sidebar',
        content: 'sidebar-content'
      }"
      :showCloseIcon="false"
    >
      <div class="side-nav-container">
        <template v-for='link in navLinks' :key='link.label'>
          <RouterLink :to="link.route" @click='toggleSidebar' class="side-nav-link">
            <i :class="['side-nav-icon', link.icon]"></i>
            <h4 class='side-nav-label'>{{ link.label }}</h4>
          </RouterLink>
        </template>
      </div>
      <Login />

    </Sidebar>
    <LoginActions />
  </div>
</template>

<style lang="scss">
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

.sidebar {
  display: flex;
  height: 100%;
  flex-direction: column;
  justify-content: space-between;
  width: 30vw;

  .sidebar-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
  }
}

.side-nav-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;

  .side-nav-link {
    width: 100%;
    background: $dash-c-purple;
    color: white;
    border-radius: 4px;
    display: flex;
    align-items: center;
    flex-direction: column;

    .side-nav-icon {
      padding: 10px;
    }

    .side-nav-label {
      text-align: center;
      padding: 0 0 10px;
      margin: 0;
      font-size: 14px;
    }
  }
}
</style>
