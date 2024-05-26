<script setup>
import { computed, ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const buttons = ref([
  { label: 'Calendar', icon: 'ri-calendar-line', route: 'calendar' },
  { label: 'Todo', icon: 'ri-todo-line', route: 'todo' },
  { label: '', icon: 'ri-home-line home', route: '/' },
  { label: 'Photos', icon: 'ri-camera-line', route: 'photos' },
  { label: 'Media', icon: 'ri-camera-line', route: 'media' }
])

onMounted(async () => {})
</script>

<template>
  <div class="footer-container">
    <div class="buttons-container">
      <RouterLink
        :to="route"
        v-for="{ label, icon, route } in buttons"
        :key="label"
        class="footer-button"
      >
        <i :class="[icon, 'footer-icon']"></i>
        <div class="button-label">{{ label }}</div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.footer-container {
  color: $dash-c-blue;
  height: 100px;
  width: 100%;
  z-index: 100;
  position: fixed;
  bottom: 0;

  .buttons-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    cursor: pointer;

    .footer-button {
      background: rgb(255 255 255 / 92%);
      color: $dash-c-blue;
      width: 25%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;

      &:last-of-type {
        border-right: 0px solid $dash-c-white;
      }

      .footer-icon {
        font-size: 30px;
        margin-bottom: 5px;

        &.home {
          font-size: 50px;
        }
      }

      &:active {
        background: $dash-c-blue;
        color: $dash-c-white;
      }
    }
  }
}
</style>
