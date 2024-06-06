<script setup>
  import KaraokeSongPicker from './KaraokeSongPicker.vue'
  import KaraokeLyrics from './KaraokeLyrics.vue'
  import KaraokePlayer from './KaraokePlayer.vue'

  // https://lrc-maker.github.io/#/synchronizer/
  // https://github.com/weirongxu/lrc-kit

  // style it
  // save the new elrc to file system
  // save isSingleLyrics value as localstorage, set up to store other data in object
  // the line time is actually the first word of the line's time
  // lyrics component getting too big
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
