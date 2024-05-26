<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import timeGridPlugin from '@fullcalendar/timegrid'
import { dashSettings } from '@/stores/dashSettings'
import WifiCode from '../components/WifiCode.vue'
import Clock from '../components/Clock.vue'
import Weather from '../components/Weather/Weather.vue'


const calendar = ref({})

onMounted(() => {})
</script>

<template>
  <div class="calendar-section">
    <Clock />
    <Weather />
    <WifiCode />
  </div>
</template>

<style lang="scss">
.calendar-section {

}
</style>
