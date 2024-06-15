<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import KData from './index.js'
import { karaoke } from '@/stores/karaoke'

const karaokeStore = karaoke()

const selectSong = async (songId) => {
  let song = await fetch(`http://127.0.0.1:3000/songs/${songId}.json`)
  song = await song.json()
  karaokeStore.set('currentSong', {
    artist: song.artist,
    name: song.name,
    tempo: song.tempo,
    url: song.song_url,
    json: JSON.parse(song.lyrics)
  })
  resetKaraoke()
}

const resetKaraoke = () => {
  // document.querySelector('.lyric-container').scrollTo(0, 0)
  karaokeStore.set('currentLyricTime', 0)
  karaokeStore.set('currentWordIndex', 0)
  karaokeStore.set('countdownNumber', 4)
}

// onMounted(() => {
//   // selectSong(KData.songs[1])
// })

onMounted(async () => {
  // let response = await fetch('http://127.0.0.1:3000/songs.json')
  // response = await response.json()
  
  
  let response = await fetch('http://127.0.0.1:3000/song_titles.json'); 

  response = await response.json()
  console.log(response)

})
</script>

<template>
  <div class="songPicker-container">
    <div
      v-for="song in KData.songs"
      :key="song.name"
      class="song-container"
      @click="selectSong(1)"
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
