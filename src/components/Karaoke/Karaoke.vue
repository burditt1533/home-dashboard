<script setup>
  import KaraokeSongPicker from './KaraokeSongPicker.vue'
  import KaraokeLyrics from './KaraokeLyrics.vue'
  import KaraokePlayer from './KaraokePlayer.vue'

  // https://lrc-maker.github.io/#/synchronizer/
  // https://github.com/weirongxu/lrc-kit

  // style it
  // save isSingleLyrics value as localstorage, set up to store other data in object
  // just finished seperating toolbar, everything works
  // toggle for edit mode
  // hide all of the edit tools when toggle is false
  // clicking line time plays second word instead of first
  // make modified word a slightly different color
  // beeps for countdown
  // add button to the right of toolbar to even it out
  // create click to edit mode/ or space to edit
  // make json file for lyrics instead of elrc


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
