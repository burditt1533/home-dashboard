<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import KData from './index.js'
import { karaoke } from '@/stores/karaoke'

const karaokeStore = karaoke()

const selectSong = async (song) => {
  let songData = await fetch(`http://127.0.0.1:3000/songs/${ song.id }.json`)
  // let songData = await fetch(`https://home-dashboard-backend.onrender.com/songs/${ song.id }.json`)
  songData = await songData.json()
  karaokeStore.set('currentSong', {
    artist: songData.artist,
    name: songData.name,
    tempo: songData.tempo,
    url: `/src/assets/music/${songData.song_url}`,
    json: JSON.parse(songData.lyrics)
  })
  resetKaraoke()
}

const resetKaraoke = () => {
  // document.querySelector('.lyric-container').scrollTo(0, 0)
  karaokeStore.set('currentLyricTime', 0)
  karaokeStore.set('currentWordIndex', 0)
  karaokeStore.set('countdownNumber', 4)
}

onMounted(async () => {
  let songs = await fetch('http://127.0.0.1:3000/song_titles.json');
  // let songs = await fetch('https://home-dashboard-backend.onrender.com/song_titles.json');
  songs = await songs.json()
  karaokeStore.set('songs', songs)
  console.log(karaokeStore.songs)
})
</script>

<template>
  <div class="songPicker-container">
    <div
      v-for="song in karaokeStore.songs"
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
