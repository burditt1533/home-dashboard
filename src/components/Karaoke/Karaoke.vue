<script setup>
  import KaraokeSongPicker from './KaraokeSongPicker.vue'
  import KaraokeLyrics from './KaraokeLyrics.vue'
  import KaraokePlayer from './KaraokePlayer.vue'

  // https://lrc-maker.github.io/#/synchronizer/
  // https://github.com/weirongxu/lrc-kit

  // style it
  // save isSingleLyrics value as localstorage, set up to store other data in object
  // make modified word a slightly different color
  // beeps for countdown
  // save to lrc and save to elrc
  // click word to change cursor position
  // approximate lyric time for unfinished lyrics on save
  // copy paste raw lyrics feature
  // music player speed to slower or faster songs
  // Player Styles

</script>

<template>
  <div class="karaoke-section">
    <KaraokeLyrics />
    <KaraokeSongPicker />
    <KaraokePlayer />
  </div>
</template>

<style lang="scss">
  .karaoke-section {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: calc(100vh - 120px);
    width: 100vw;
    padding: $dash-c-home-gap $dash-c-home-gap 0;
  }
</style>
