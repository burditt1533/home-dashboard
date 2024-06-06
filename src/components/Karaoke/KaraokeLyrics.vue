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
const displayedLyrics = ref([])
const lyricModifierModal = ref(null)
const currentModifiedLyric = ref(0)
const currentModifiedLine = ref(0)
const currentModifiedLineIndex = ref(0)
const modifiedLyricToHear = ref(0)
const sliderValue = ref(0)
const isForceCurrentIndex = ref(true)
const modifiedLyrics = ref([])
const isModifyStartTime = ref(false)

watch(() => karaokeStore.parsedElrc,() => {
  displayedLyrics.value = karaokeStore.currentSong.lyrics.reformatted
})

watch(
  () => karaokeStore.currentLyricTime,
  () => {
    const params = {
      currentLineIndex: karaokeStore.currentLineIndex,
      prevLineIndex: prevLineIndex.value,
      currentSongTime: karaokeStore.currentLyricTime,
      parsedElrc: displayedLyrics.value,
      currentWordIndex: currentWordIndex.value,
      isForceCurrentIndex: isForceCurrentIndex.value
    }
    prevLineIndex.value = karaokeStore.currentLineIndex

    if (!isForceCurrentIndex.value) {
      currentWordIndex.value = getCurrentWordIndex.init(params)
    }

    isForceCurrentIndex.value = false
  }
)

const formattedLyrics = computed(() => {
  return karaokeStore.isSingleLyricLine ? [lyricLine.value] : displayedLyrics.value
})

const lyricLine = computed(() => {
  return displayedLyrics.value[karaokeStore.currentLineIndex] || []
})

const isMusicStarted = computed(() => {
  return karaokeStore.musicPlayer.currentTime > 0
})

const toTimer = function (time, withHours) {
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

const currentLyricElement = computed(() => {
  return document.getElementById('lyric-' + karaokeStore.currentLineIndex)
})

const goToCurrentLyric = (newIndex) => {
  karaokeStore.set('currentLineIndex', newIndex)
  // currentLyricElement.value?.scrollIntoView({
  //   behavior: 'smooth',
  //   block: 'center',
  //   inline: 'center'
  // })
}

const modifyStartTime = (clickedWord, lineIndex, wordIndex) => {
  currentWordIndex.value = wordIndex
  isForceCurrentIndex.value = true
  isModifyStartTime.value = true

  goToCurrentLyric(lineIndex)

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

const showLyricTime = (clickedWord, lineIndex, wordIndex, isModifyingStart) => {
  currentWordIndex.value = wordIndex
  isForceCurrentIndex.value = true

  goToCurrentLyric(lineIndex)

  lyricModifierModal.value = true

  const prevLine = displayedLyrics.value[lineIndex - 1]
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
<div>
  <div :class="['lyric-container', { single: karaokeStore.isSingleLyricLine }]">
    <div v-if="!karaokeStore.currentSong.name" class="music-info">Choose A Song</div>
    <template v-else-if="isMusicStarted">
      <div
        v-for="(line, lineIndex) in formattedLyrics"
        :key="line.time"
        :class="[
          'lyric-wrap',
          { current: lineIndex === karaokeStore.currentLineIndex || karaokeStore.isSingleLyricLine },
          { editMode: karaokeStore.isEditMode }
        ]"
        :id="'lyric-' + lineIndex"
      >
        <span
          v-if="karaokeStore.isEditMode"
          class="smaller"
          @click="modifyStartTime(line[0], lineIndex, 0)"
        >
          {{ line[0].lineStartData }}
        </span>

        <span
          v-for="(word, wordIndex) in line"
          :key="wordIndex"
          :style="{ transitionDuration: karaokeStore.isEditMode ? 0 : `${word.timeUntilNext}s` }"
          :class="[
            'lyric',
            {
              highlight:
                `${lineIndex}-${wordIndex}` ===
                `${karaokeStore.isSingleLyricLine ? 0 : karaokeStore.currentLineIndex}-${currentWordIndex}`
            },
            { modifiying: word === currentModifiedLyric }
          ]"
          @click="showLyricTime(word, lineIndex, wordIndex)"
        >
          <div class="stacked-lyric">
            <span>{{ word.lyric + ' ' }}</span>
            <span :class="['smaller', { modified: modifiedLyrics.includes(word) }]">{{ word.time }}</span>
          </div>
        </span>
      </div>
    </template>

    <div v-else-if="karaokeStore.countdownNumber < 4" class="countdown">{{ karaokeStore.countdownNumber }}</div>

    <div v-else class="music-info">
      <div>{{ karaokeStore.currentSong.artist }}</div>
      <div>{{ karaokeStore.currentSong.name }}</div>
    </div>
  </div>

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
</div>
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

.lyric-container {
  background: $dash-c-card-bg;
  width: 100%;
  // height: 70vh;
  height: 60vh;
  overflow: scroll;
  padding: 120px 20px;

  .lyric-wrap {
    color: white;
    font-size: 40px;
    opacity: 0.2;
    text-align: center;
    margin-bottom: 50px;
    line-break: anywhere;
    transform: scale(0.7);
    transition: opacity 700ms, transform 300ms;
    display: flex;
    justify-content: center;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;

    .smaller {
      font-size: 12px;
      cursor: pointer;

      &.modified {
        color: orange;
      }
    }

    &.editMode {
      transform: scale(1);
      opacity: 1;
      transition: none;
    }

    .stacked-lyric {
      display: inline-flex;
      flex-direction: column;
    }

    .lyric {
      background-size: 100%;
      transition-property: background-size;
      background-clip: text;
      background-repeat: no-repeat;
      background-image: linear-gradient(to right, orange 100%, white 1%);
      cursor: pointer;

      &.modifiying {
        color: orange;
        transition-duration: 0ms !important;
      }
    }

    &.current {
      transform: scale(1);
      opacity: 1;

      .lyric {
        &.highlight {
          color: transparent;
          background-image: linear-gradient(to right, orange 001%, white 1.2%);
          background-size: 10000%;
        }
      }
    }
  }

  .music-info {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 30vh;
    font-size: 30px;
  }

  .countdown {
    font-size: 176px;
    font-weight: bold;
    opacity: 0.6;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  &.single {
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .lyric {
      opacity: 1;
      margin-bottom: 0;
    }
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
