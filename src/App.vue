<script setup>
  import { RouterView } from 'vue-router'
  import Footer from './components/Footer.vue'
  import Header from './components/Header.vue'
</script>

<template>
  <div class='site-container'>
    <Header />
    <RouterView class='router-view'/>
    <Footer />
  </div>
</template>

<style scoped>

.site-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  overflow: hidden;
}

.router-view {
  height: calc(100vh - 100px);
  overflow-y: scroll;
}

</style>
