import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const karaoke = defineStore('karaoke', {
  state: () => ({
    songs: [],
    musicPlayer: {},
    currentSong: {},
    isSingleLyricLine: false,
    currentLyricTime: 0,
    currentWordIndex: 0,
    runnerOffset: 0,
    countdownNumber: 4,
    isEditMode: false
  }),
  getters: {
    groupedLyrics () {
      return Object.groupBy(this.currentSongLyrics, ({ lineIndex }) => lineIndex) || []
    },
    currentSongLyrics() {
      return this.currentSong?.json || []
    },
    previousLineIndex() {
      return this.currentLineIndex === 0 ? this.currentLineIndex : this.currentLineIndex - 1
    },
    currentLineIndex () {
      return this.currentLyric.lineIndex || 0
    },
    nextLineIndex() {
      return this.currentLineIndex + 1
    },
    previousLine() {
      return this.groupedLyrics[this.previousLineIndex]
    },
    currentLine() {
      return this.groupedLyrics[this.currentLineIndex] || []
    },
    nextLine() {
      return this.groupedLyrics[this.nextLineIndex] || []
    },
    previousLyric() {
      return this.currentSongLyrics[this.currentWordIndex - 2] || {}
    },
    currentLyric() {
      return this.currentSongLyrics[this.currentWordIndex - 1] || {}
    },
    nextLyric() {
      return this.currentSongLyrics[this.currentWordIndex] || {}
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
    },
    getCurrentWordIndex () {
      if (this.currentLyricTime > this.nextLyric?.time) {
        this.currentWordIndex ++;
      }
    }
  }
})
