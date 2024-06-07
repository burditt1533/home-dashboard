import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { karaoke } from '@/stores/karaoke'

export const karaokeToolbar = defineStore('karaokeToolbar', {
  state: () => ({
    currentModifiedLineIndex: 0,
    currentModifiedLyricIndex: 0,
    isModifyStartTime: false,
    modifiedLyrics: [],
    modifySliderTime: 0 
  }),
  getters: {
    currentSongLyrics(state) {
      return karaoke().currentSong.lyrics?.reformatted || []
    },
    previousModifiedLineIndex(state) {
      return state.currentModifiedLine === 0 ? state.currentModifiedLineIndex : state.currentModifiedLineIndex - 1
    },
    previousModifiedLine() {
      return this.currentSongLyrics[this.previousModifiedLineIndex]
    },
    nextLineIndex(state) {
      return state.currentModifiedLineIndex + 1
    },
    currentModifiedLine(state) {
      return this.currentSongLyrics[state.currentModifiedLineIndex] || {}
    },
    nextModifiedLine() {
      return this.currentSongLyrics[this.nextLineIndex] || []
    },
    currentModifiedLyric(state) {
      return this.currentModifiedLine[state.currentModifiedLyricIndex] || {}
    },
    previousModifiedLyric(state) {
      const isFirstWord = state.currentModifiedLyricIndex === 0
      const lastWordOfNextLine = this.previousModifiedLine[this.previousModifiedLine.length - 1] || {}
      return isFirstWord ? lastWordOfNextLine : this.currentModifiedLine[state.currentModifiedLyricIndex - 1] || {}
    },
    nextModifiedLyric(state) {
      const isLastWord = state.currentModifiedLyricIndex === this.currentModifiedLine.length - 1
      const firstWordOfNextLine = this.nextModifiedLine[0] || {}
      return isLastWord ? firstWordOfNextLine : this.currentModifiedLine[state.currentModifiedLyricIndex + 1] || {}
    },
  },
  actions: {
    set(property, value) {
      this[property] = value
    },
    updateLyricTime (time) {
      this.currentModifiedLyric.time = time
      this.modifiedLyrics.push(this.currentModifiedLyric)
      this.currentModifiedLineIndex = 0
      this.currentModifiedLyricIndex = 0
    },
    updateLineStartTime (time) {
      this.currentModifiedLine.forEach((lyric) => (lyric.lineStartData = time))
      this.modifiedLyrics.push(this.currentModifiedLyric) // make this the beginning line number

      karaoke().currentSong.lyrics.raw.lyrics[this.currentModifiedLineIndex].timestamp = time
      karaoke().runner.lrc.lyrics = karaoke().currentSong.lyrics.raw.lyrics
      karaoke().runner.lrcUpdate()

      this.currentModifiedLineIndex = 0
      this.currentModifiedLyricIndex = 0
    }
  }
})
