<template>
  <div class="about">
    <Flickr />
  </div>
</template>

<script setup>
  import Flickr from '../components/Flickr/Flickr.vue'
</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    padding-bottom: 150px;
  }
}
</style>
