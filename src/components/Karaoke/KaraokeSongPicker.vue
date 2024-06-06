<script setup>
  import { computed, ref, onMounted, watch } from 'vue'
  import KData from './index.js'
  import { Runner } from 'lrc-kit'
  import { dashKaraoke } from '@/stores/dashKaraoke'

  const karaokeStore = dashKaraoke()

  const selectSong = (song) => {
    karaokeStore.set('currentSong', song)
    karaokeStore.set('parsedElrc', karaokeStore.currentSong.lyrics.formatted)
    karaokeStore.set('runner', new Runner(karaokeStore.currentSong.lyrics.raw))
    resetKaraoke()
  }

  const resetKaraoke = () => {
    document.querySelector('.lyric-container').scrollTo(0, 0)
    karaokeStore.set('currentLyricTime', 0)
    karaokeStore.set('currentLineIndex', -1)
    karaokeStore.set('countdownNumber', 4)
  }

  onMounted(() => {
    selectSong(KData.songs[1])
  })
</script>

<template>
  <div class="songPicker-container">
    <div
      v-for="song in KData.songs"
      :key="song.name"
      class="song-container"
      @click="selectSong(song)"
    >
      <div v-show="song.name === karaokeStore.currentSong.name" class="note">♫</div>
      <div class="name">{{ song.name }}</div>
      <div class="artist">{{ song.artist }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.songPicker-container {
  display: flex;
  gap: 20px;
  height: 15%;
  width: 100%;
  margin: 10px 0;
  overflow-x: scroll;

  .song-container {
    height: 100%;
    min-width: 200px;
    border-radius: 4px;
    background: $dash-c-purple;
    color: white;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    font-weight: 700;

    .name {
      margin-bottom: 15px;
    }
  }
}
</style>
