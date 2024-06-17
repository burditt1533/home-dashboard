<script setup>
// import { RouterLink, RouterView } from 'vue-router'

import { ref, onMounted } from 'vue'
import Weather from '../components/Weather/Weather.vue'
import ToDoList from '../components/TodoList/ToDoList.vue'
import Budget from '../components/Budget.vue'
import Clock from '../components/Clock.vue'
import Calendar from '../components/Calendar/Calendar.vue'
import Train from '../components/Train.vue'
import WifiCode from '../components/WifiCode.vue'
</script>

<template>
  <div class="dash">
    <div>
      <Clock />
      <Weather />
    </div>
    <Train />
    <WifiCode />
    <ToDoList />
    <Budget />
    <Calendar />

    <!-- Food Menu -->
    <!-- Shower Order -->
    <!-- Music/Video Player -->
    <!-- Karaoke -->
      <!-- make bg more interesting -->
      <!-- Build catalogue -->
      <!-- have song with lyrics and instrumental option -->
      <!-- add music player -->
        <!-- build controls -->
      <!-- add song picker -->
    <!-- Large Image -->
    <!-- Distance to work -->
    <!-- Garage Opener -->
    <!-- Doorbell/camera Viewer -->
    <!-- Grocery List -->
    <!-- Walmart Grocery api -->
    <!-- Smart Home Control -->
    <!-- Games -->
    <!-- Guest View -->
    <!-- Each Person's personal page -->
    <!-- click todo names to open personal todo page -->
    <!-- Clean up system -->

  </div>
</template>

<style scoped lang="scss">
.dash {
  display: flex;
  flex-direction: column;
  gap: $dash-c-home-gap;
  width: 100vw;
  padding: $dash-c-home-gap $dash-c-home-gap 100px;
  overflow-x: hidden;

  .dash-section {
    // margin: 0 20px;
  }
}
</style>
