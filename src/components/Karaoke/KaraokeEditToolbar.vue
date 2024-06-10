<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import Knob from 'primevue/knob'
import { karaoke } from '@/stores/karaoke'
import { karaokeToolbar } from '@/stores/karaokeToolbar'
import { storeToRefs } from "pinia";

const karaokeStore = karaoke()
const karaokeToolbarStore = karaokeToolbar()

const { isClickEditMode } = storeToRefs(karaokeToolbarStore);

const sliderValue = ref(0)
const isForceCurrentIndex = ref(true)
// const isClickEditMode = ref(false)
const editCursor = ref(0)

const toTimer = (time, withHours) => {
  var h, m, s, ms
  h = Math.floor(time / 3600)
  h = isNaN(h) ? '--' : h >= 10 ? h : '0' + h
  m = withHours ? Math.floor((time / 60) % 60) : Math.floor(time / 60)
  m = isNaN(m) ? '--' : m >= 10 ? m : '0' + m
  s = Math.floor(time % 60)
  s = isNaN(s) ? '--' : s >= 10 ? s : '0' + s
  ms = Math.floor((time - Math.floor(time)) * 1000)
  ms = isNaN(ms) ? '--' : ms >= 100 ? ms : ms > 10 ? '0' + ms : '00' + ms
  return withHours ? h + ':' + m + ':' + s : m + ':' + s + '.' + ms
}

const handleSaveClick = (lyricTime) => {
  const kts = karaokeToolbarStore
  const newTime = lyricTime || kts.currentModifiedLyric.time + sliderValue.value

  kts.updateLyricTime(newTime)

  // convertToElrc()
  convertToJson()
  resetModifiers()
}

const convertToElrc = async () => {
  // TODO: need to accomodate moving the times forwards
  let sheet = ''
  karaokeStore.groupedLyrics.forEach((line, index) => {
    line.forEach((lyric, index) => {
      if (lyric.lyric === '[STARTOFLINE]') {
        sheet += '\n[' + toTimer(lyric.time) + '] '
      } else {
        sheet += `${lyric.lyric} <${toTimer(lyric.time)}> `
      }
    })
  })

  navigator.clipboard.writeText(sheet)
}

const convertToJson = async () => {
  const json = JSON.stringify(karaokeStore.currentSongLyrics)
  navigator.clipboard.writeText(json)
}

const resetModifiers = () => {
  karaokeToolbarStore.set('currentModifiedLyricIndex', -1)
  sliderValue.value = 0
  karaokeToolbarStore.set('modifySliderTime', sliderValue.value)
}

const updateSliderValue = (amount) => {
  sliderValue.value += amount
  karaokeToolbarStore.set('modifySliderTime', sliderValue.value)

  runItBack()
}

const runItBack = () => {
  karaokeStore.setPlaybackPosition(karaokeToolbarStore.lyricToHear + sliderValue.value)
}

const logIt = () => {
  if (isClickEditMode.value) {
    let lyricToEdit = karaokeStore.currentSongLyrics.find(({ lyricIndex }) => {
      return lyricIndex === karaokeToolbarStore.editCursor
    })
    karaokeToolbarStore.updateCursorLyricTime(lyricToEdit, karaokeStore.musicPlayer.currentTime)
  }
}

const knobValueTemplate = (value) => {
  return (karaokeToolbarStore.currentModifiedLyric?.time + value).toFixed(3)
}

const handleKeyboardInput = (e) => {
  if (e.code === 'Space') {
    e.preventDefault();
    logIt()
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleKeyboardInput);
})
</script>

<template>
  <Toolbar
    :pt="{
      root: { class: 'toolbar' },
      start: { class: 'left' },
      center: { class: 'middle' },
      end: { class: 'right' }
    }"
  >
    <template #start>
      {{ karaokeToolbarStore.currentModifiedLyric?.lyric }} -
      {{ karaokeToolbarStore.currentModifiedLyric?.time }}
    </template>

    <template #center>
      <Button @click="logIt" icon="ri-time-line" severity="secondary" />
      <Button @click="sliderValue = 0" icon="ri-delete-back-line" severity="secondary" />
      <Button
        @click="updateSliderValue(-0.05)"
        icon="ri-subtract-line"
        class="mr-2"
        severity="secondary"
      />
      <Knob
        class="knob"
        v-model="sliderValue"
        :step="0.001"
        :min="-10"
        :max="10"
        :size="70"
        :strokeWidth="5"
        readonly
        @click="runItBack"
        :valueTemplate="knobValueTemplate"
      />
      <Button
        @click="updateSliderValue(0.05)"
        icon="ri-add-line"
        class="mr-2"
        severity="secondary"
      />
      <Button @click="handleSaveClick" icon="ri-save-line" severity="secondary" />
      <Button
        @click="isClickEditMode = !isClickEditMode"
        icon="ri-edit-2-line"
        :severity="isClickEditMode ? 'info' : 'secondary'"
      />
    </template>

    <template #end> </template>
  </Toolbar>
</template>

<style lang="scss">
.knob {
  svg {
    outline: 0;
    border: 0;
    cursor: pointer;
  }
}

.toolbar {
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.863);
  border: none;
  margin-top: 10px;

  .left {
    width: 20%;
  }

  .middle {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
  }

  .right {
    width: 20%;
  }
}
</style>
