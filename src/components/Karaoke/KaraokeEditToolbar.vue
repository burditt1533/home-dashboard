<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import Toolbar from 'primevue/toolbar'
import Button from 'primevue/button'
import { Runner } from 'lrc-kit'
import Knob from 'primevue/knob'
import { karaoke } from '@/stores/karaoke'
import { karaokeToolbar } from '@/stores/karaokeToolbar'

const karaokeStore = karaoke()
const karaokeToolbarStore = karaokeToolbar()

const currentWordIndex = ref(0)
const prevLineIndex = ref(0)
const prevCurrentTime = ref(-1)
const lyricModifierModal = ref(null)
const currentModifiedLyric = ref(0)
const currentModifiedLine = ref(0)
const currentModifiedLineIndex = ref(0)
const modifiedLyricToHear = ref(0)
const sliderValue = ref(0)
const isForceCurrentIndex = ref(true)
const isModifyStartTime = ref(false)
const isClickEditMode = ref(false)
const editCursor = ref(0)
const editLineCursor = ref(0)

const displayedLyrics = computed(() => {
  return karaokeStore.currentSong.lyrics.reformatted
})

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

const updateLyricTime = (property, lyricTime) => {
  const kts = karaokeToolbarStore
  const oldTime = property === 'lineData' ?  kts.currentModifiedLyric.lineData.time : kts.currentModifiedLyric.time
  const newTime = lyricTime || oldTime + sliderValue.value

  kts.isModifyStartTime ? kts.updateLineStartTime(newTime) : kts.updateLyricTime(newTime)

  updateElrcFile()
  resetModifiers()
}

const handleSaveClick = () => {
  const property = karaokeToolbarStore.isModifyStartTime ? 'lineData' : 'time'
  updateLyricTime(property)
}


const updateElrcFile = async () => {
  let sheet = ''

  displayedLyrics.value.forEach((line, index) => {
    if (index === 0) return
    sheet += '\n[' + toTimer(line[0].lineData.time) + '] '

    line.forEach((lyric) => {
      sheet += `${lyric.lyric} <${toTimer(lyric.time)}> `
    })

    sheet += '\n'
  })
  // console.log(sheet)

  navigator.clipboard.writeText(sheet)
}

const resetModifiers = () => {
  currentModifiedLyric.value = null
  modifiedLyricToHear.value = null
  isModifyStartTime.value = false
  sliderValue.value = 0
}

const updateSliderValue = (amount) => {
  sliderValue.value += amount
  karaokeToolbarStore.set('modifySliderTime', sliderValue.value)

  runItBack()
}

const runItBack = () => {
  // const kts = karaokeToolbarStore
  // const lyric = karaokeToolbarStore.isModifyStartTime ? kts.previousModifiedLyric : kts.currentModifiedLyric

  karaokeStore.setPlaybackPosition(karaokeToolbarStore.lyricToHear + sliderValue.value)
}

const logIt = () => {
  // const time = karaokeStore.musicPlayer.currentTime
  // updateLyricTime(time)
  // console.log(time)
  // console.log(karaokeStore.currentSong.lyrics.reformatted)

  // let theLyric = null
  // karaokeStore.currentSong.lyrics.reformatted.some((line) => {
  //   return theLyric = line.find(({ index }) => index === editCursor.value)
  // })

  // karaokeToolbarStore.updateCursorLyricTime(theLyric)
  // editCursor.value++

  // let isLyricFound = false
  // karaokeStore.currentSong.lyrics.reformatted.forEach((line) => {

  //   line.forEach(lyric => {
  //     if(lyric.index === editCursor.value) {
  //       karaokeToolbarStore.updateCursorLyricTime(lyric, karaokeStore.musicPlayer.currentTime)
  //       isLyricFound = true
  //     }
  //   })
  // })
  // editCursor.value++

  const lyricDump = []
  karaokeStore.currentSong.lyrics.reformatted.forEach((line, index) => {
    if (index > 0) {
      line.forEach(lyric => {
        lyricDump.push(lyric)
      })
    }
  })
  console.log(lyricDump);

  //edit just line start time

  // karaokeToolbarStore.updateCursorLineTime(editLineCursor.value)
  // editLineCursor.value++
}
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
        :valueTemplate="
          (value) => {
            const t = karaokeToolbarStore.isModifyStartTime
              ? karaokeToolbarStore.currentModifiedLyric?.lineData.time
              : karaokeToolbarStore.currentModifiedLyric?.time
            return (t + value).toFixed(3)
          }
        "
      />
      <Button
        @click="updateSliderValue(0.05)"
        icon="ri-add-line"
        class="mr-2"
        severity="secondary"
      />
      <Button
        @click="handleSaveClick"
        icon="ri-save-line"
        severity="secondary"
      />
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
