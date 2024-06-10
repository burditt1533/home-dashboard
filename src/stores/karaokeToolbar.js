import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { karaoke } from '@/stores/karaoke'

export const karaokeToolbar = defineStore('karaokeToolbar', {
  state: () => ({
    // currentModifiedLineIndex: 0,
    currentModifiedLyricIndex: -1,
    modifiedLyrics: [],
    modifySliderTime: 0,
    editCursor: 0,
    isClickEditMode: false
  }),
  getters: {
    currentSongLyrics(state) {
      return karaoke().currentSong?.lyrics?.lyricDump || []
    },
    currentModifiedLyric(state) {
      return this.currentSongLyrics[state.currentModifiedLyricIndex] || {}
    },
    previousModifiedLyric(state) {
      return this.currentSongLyrics[state.currentModifiedLyricIndex - 1] || {}
    },
    nextModifiedLyric(state) {
      return this.currentSongLyrics[state.currentModifiedLyricIndex + 1] || {}
    },
    lyricToHear() {
      return this.currentModifiedLyric.time
    }
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
    updateCursorLyricTime (lyric, time) {
      lyric.time = time
      this.modifiedLyrics.push(lyric)
      this.editCursor++
    }
  }
})
