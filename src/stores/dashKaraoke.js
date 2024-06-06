import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const dashKaraoke = defineStore('dashKaraoke', {
  state: () => ({
    musicPlayer: {},
    currentSong: {},
    isSingleLyricLine: false,
    currentSongTime: 0,
    currentLyricTime: 0,
    currentLineIndex: 0,
    currentWordIndex: 0,
    runner: {},
    runnerOffset: 300,
    countdownNumber: 4,
    parsedElrc: [],
    isEditMode: true
  }),
  getters: {
    // doubleCount: (state) => state.count * 2,
  },
  actions: {
    set(property, value) {
      this[property] = value
    },
  },
})