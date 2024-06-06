<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import InputSwitch from 'primevue/inputswitch'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button'
import getCurrentWordIndex from './getCurrentWordIndex.js'
import { Runner } from 'lrc-kit'
import Knob from 'primevue/knob'
import { dashKaraoke } from '@/stores/dashKaraoke'

const karaokeStore = dashKaraoke()

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
const modifiedLyrics = ref([])
const isModifyStartTime = ref(false)

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

const modifyStartTime = (clickedWord, lineIndex, wordIndex) => {
  currentWordIndex.value = wordIndex
  isForceCurrentIndex.value = true
  isModifyStartTime.value = true

  karaokeStore.set('currentLineIndex', lineIndex)

  lyricModifierModal.value = true

  const prevLine = displayedLyrics.value[lineIndex - 1]
  const lastOfPrevLine = prevLine[prevLine.length - 1]
  const prevWordIndex = currentWordIndex.value - 1
  const isFirstWord = currentWordIndex.value === 0

  currentModifiedLine.value = displayedLyrics.value[lineIndex]
  modifiedLyricToHear.value = isFirstWord ? lastOfPrevLine : currentModifiedLine.value[prevWordIndex]
  currentModifiedLyric.value = currentModifiedLine.value[currentWordIndex.value]
  currentModifiedLineIndex.value = lineIndex

  runItBack()
}

const showLyricTime = (clickedWord, lineIndex, wordIndex) => {
  currentWordIndex.value = wordIndex
  isForceCurrentIndex.value = true

  karaokeStore.set('currentLineIndex', lineIndex)
  lyricModifierModal.value = true

  const prevLine = lineIndex === 0 ? displayedLyrics.value[0] : displayedLyrics.value[lineIndex - 1]
  const lastOfPrevLine = prevLine[prevLine.length - 1]
  const prevWordIndex = currentWordIndex.value - 1
  const isFirstWord = currentWordIndex.value === 0

  modifiedLyricToHear.value = isFirstWord ? lastOfPrevLine : displayedLyrics.value[lineIndex][prevWordIndex]
  currentModifiedLyric.value = displayedLyrics.value[lineIndex][currentWordIndex.value]

  runItBack()
}

const updateLineStartTime = () => {
  currentModifiedLine.value.forEach((lyric) => lyric.lineStartData += sliderValue.value)

  karaokeStore.currentSong.lyrics.raw.lyrics[currentModifiedLineIndex.value].timestamp = currentModifiedLyric.value.lineStartData + sliderValue.value
  const newSong = karaokeStore.currentSong

  karaokeStore.set('currentSong', newSong)
  karaokeStore.set('runner', new Runner(karaokeStore.currentSong.lyrics.raw))
  
  updateElrcFile()
  resetModifiers()
}

const updateLyricTime = (lyricTime) => {
  if(!!lyricTime) {
    currentModifiedLyric.value.time = lyricTime
  } else {
    currentModifiedLyric.value.time += sliderValue.value
  }

  updateElrcFile()
  resetModifiers()
}

const updateElrcFile = async () => {
  let sheet = ''

  displayedLyrics.value.forEach((line, index) => {
    if (index === 0) return
    sheet += '\n[' + toTimer(line[0].lineStartData) + '] '

    line.forEach((lyric) => {
      sheet += `${lyric.lyric} <${toTimer(lyric.time)}> `
    })

    sheet += '\n'
  })
  // console.log(sheet)

  navigator.clipboard.writeText(sheet)
}

const resetModifiers = () => {
  modifiedLyrics.value.push(currentModifiedLyric.value)
  currentModifiedLyric.value = null
  modifiedLyricToHear.value = null
  isModifyStartTime.value = false
  sliderValue.value = 0
}

const runItBack = () => {
  const lyric = isModifyStartTime.value ? modifiedLyricToHear.value :  currentModifiedLyric.value
  karaokeStore.musicPlayer.$refs.audio.currentTime = lyric.time + sliderValue.value
  karaokeStore.musicPlayer.currentTime = lyric.time + sliderValue.value
  karaokeStore.musicPlayer.play()
}

const updateSliderValue = (amount) => {
  sliderValue.value += amount
  runItBack()
}

const onHideModal = () => {
  sliderValue.value += 0
}

const logIt = () => {
  const time = karaokeStore.musicPlayer.currentTime
  updateLyricTime(time)
  console.log(time, toTimer(time))
}
</script>

<template>
  <Toolbar :pt="{
      root: { class: 'toolbar' },
      start: { class: 'left' },
      center: { class: 'middle' },
      end: { class: 'right' }
    }"
  >
    <template #start >
      {{ currentModifiedLyric?.lyric }} - {{ currentModifiedLyric?.time }}
    </template>

    <template #center>
      <Button @click='logIt' icon="ri-time-line" severity="secondary" />
      <Button @click='sliderValue = 0' icon="ri-delete-back-line" severity="secondary" />
      <Button @click="updateSliderValue(-0.05)" icon="ri-subtract-line" class="mr-2" severity="secondary" />
        <Knob
          class='knob'
          v-model="sliderValue"
          :step="0.001"
          :min="-10"
          :max="10"
          :size='70'
          :strokeWidth="5"
          readonly
          @click='runItBack'
          :valueTemplate="(value) => {
            const t = isModifyStartTime ? currentModifiedLyric?.lineStartData : currentModifiedLyric?.time
            return (t + value).toFixed(3)
          }"
        />
      <Button @click="updateSliderValue(0.05)" icon="ri-add-line" class="mr-2" severity="secondary" />
      <Button @click="isModifyStartTime.value ? updateLineStartTime : updateLyricTime" icon="ri-save-line" severity="secondary" />
    </template>

    <template #end>
        
    </template>
  </Toolbar>
</template>

<style lang="scss">
.modifier-container {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
}

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
