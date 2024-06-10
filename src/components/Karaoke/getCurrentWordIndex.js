let currentSongTime = 0
let lyricDump = []
let currentWordIndex = -1
let currentWordData = {}

const init = (params) => {
  const isForceCurrentIndex = params.isForceCurrentIndex
  currentSongTime = params.currentSongTime
  lyricDump = params.lyricDump
  currentWordIndex = params.currentWordIndex
  currentWordData = lyricDump[currentWordIndex]

  if (currentSongTime > currentWordData?.time) {
    currentWordIndex ++;
  }
  return currentWordIndex
} 

export default {
  init
};