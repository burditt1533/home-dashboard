import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const karaoke = defineStore('karaoke', {
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
    currentSongLyrics(state) {
      return state.currentSong.lyrics.reformatted
    },
    previousLineIndex(state) {
      return state.currentLineIndex === 0 ? state.currentLineIndex : state.currentLineIndex - 1
    },
    previousLine() {
      return this.currentSongLyrics[this.previousLineIndex]
    },
    nextLineIndex(state) {
      return state.currentLineIndex + 1
    },
    currentLine(state) {
      return this.currentSongLyrics[state.currentLineIndex]
    },
    nextLine() {
      return this.currentSongLyrics[this.nextLineIndex] || []
    },
    currentWord(state) {
      return this.currentLine[state.currentWordIndex] || {}
    },
    previousWord(state) {
      const isFirstWord = state.currentWordIndex === 0
      const lastWordOfNextLine = this.previousLine[this.previousLine.length - 1] || {}
      return isFirstWord ? lastWordOfNextLine : this.currentLine[state.currentWordIndex - 1] || {}
    },
    nextWord(state) {
      const isLastWord = state.currentWordIndex === this.currentLine.length - 1
      const firstWordOfNextLine = this.nextLine[0] || {}
      return isLastWord ? firstWordOfNextLine : this.currentLine[state.currentWordIndex + 1] || {}
    }
  },
  actions: {
    set(property, value) {
      this[property] = value
    },
    setPlaybackPosition (time) {
      this.musicPlayer.$refs.audio.currentTime = time
      this.musicPlayer.currentTime = time

      this.musicPlayer.play()

      // karaokeStore.set('runner', new Runner(karaokeStore.currentSong.lyrics.raw))
    }
  }
})
