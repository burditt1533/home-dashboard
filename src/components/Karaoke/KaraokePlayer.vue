<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import InputSwitch from 'primevue/inputswitch'
import InputNumber from 'primevue/inputnumber'
import Button from 'primevue/button'
import AudioPlayer from '@liripeng/vue-audio-player'
import { karaoke } from '@/stores/karaoke'

const karaokeStore = karaoke()
const runnerOffset = ref(300)
const isSingleLyricLine = ref(false)
const audioPlayerRef = ref(null)

const currentLyricElement = computed(() => {
  return document.getElementById('lyric-' + karaokeStore.currentLineIndex)
})

const goToCurrentLyric = () => {
  karaokeStore.set('currentLineIndex', karaokeStore.runner.curIndex())
  // currentLyricElement.value?.scrollIntoView({
  //   behavior: 'smooth',
  //   block: 'center',
  //   inline: 'center'
  // })
}

const timeUpdate = (e) => {
  // console.log(e.srcElement.currentTime, karaokeStore.musicPlayer.currentTime)
  // console.log(karaokeStore.musicPlayer.currentTime)
  karaokeStore.set(
    'currentLyricTime',
    // karaokeStore.musicPlayer.currentTime + karaokeStore.runnerOffset / 1000
    e.srcElement.currentTime + karaokeStore.runnerOffset / 1000
  )
  karaokeStore.runner.timeUpdate(karaokeStore.currentLyricTime)

  if (karaokeStore.runner.curIndex() >= karaokeStore.currentLineIndex) {
    goToCurrentLyric()
  }
}

const progressMove = (e) => {
  // karaokeStore.musicPlayer.pause()
  karaokeStore.set(
    'currentLyricTime',
    karaokeStore.musicPlayer.currentTime + karaokeStore.runnerOffset / 1000
  )
  karaokeStore.runner.timeUpdate(karaokeStore.currentLyricTime)
  goToCurrentLyric()
}

const singleLyricLineChange = () => {
  karaokeStore.set('isSingleLyricLine', isSingleLyricLine.value)
}

const startCoundown = (next) => {
  const bps = (60 / karaokeStore.currentSong.tempo) * 1000
  if (karaokeStore.countdownNumber === 1 || karaokeStore.isEditMode) {
    next()
  } else {
    karaokeStore.set('countdownNumber', karaokeStore.countdownNumber - 1)
    setTimeout(() => {
      startCoundown(next)
    }, bps)
  }
}

const audioList = computed(() => {
  return [
    {
      name: 'audio1',
      url: karaokeStore.currentSong.url
    }
  ]
})

const onOffsetChange = () => {
  karaokeStore.set('runnerOffset', runnerOffset.value)
}

onMounted(() => {
  karaokeStore.set('musicPlayer', audioPlayerRef.value)
})
</script>

<template>
  <div class="player-container">
    <div class="control-bar">
      <InputSwitch v-model="isSingleLyricLine" @update:modelValue="singleLyricLineChange" />
      <div class="music-info">
        <div v-if="!!karaokeStore.currentSong.artist">
          {{ karaokeStore.currentSong.artist }} - {{ karaokeStore.currentSong.name }}
        </div>
      </div>
      <InputNumber
        @update:modelValue="onOffsetChange"
        v-model="runnerOffset"
        inputId="horizontal-buttons"
        showButtons
        buttonLayout="horizontal"
        :step="100"
        :pt="{
          root: { class: ['offset'] }
        }"
      >
        <template #incrementbuttonicon>
          <span class="ri-add-line" />
        </template>
        <template #decrementbuttonicon>
          <span class="ri-subtract-line" />
        </template>
      </InputNumber>
    </div>
    <audio-player
      ref="audioPlayerRef"
      :audioList="audioList.map((song) => song.url)"
      :beforePlay="startCoundown"
      theme-color="white"
      :progressInterval="100"
      @timeupdate="timeUpdate"
      @progressMove="progressMove"
    />
  </div>
</template>

<style lang="scss">
.player-container {
  background: $dash-c-card-bg;
  padding: 20px 0;
  height: 15%;

  .play-icon {
    font-size: 50px;
    cursor: pointer;
  }
}

.control-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .music-info {
    display: flex;
    gap: 7px;
    align-items: center;
    font-size: 20px;
    padding-left: 20px;
  }

  .offset {
    input {
      width: 100px;
    }
  }
}
</style>
