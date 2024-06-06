let currentLineIndex = 0
let currentSongTime = 0
let parsedElrc = []
let currentWordIndex = -1
let prevLineIndex = 0
let currentLineData = []

const updateIndex = (firstTimeStamp) => {
  const currentMaxIndex = currentLineIndex === -1 ? 0 : currentLineData.length
  const addend = currentWordIndex >= currentMaxIndex ? 0 : 1;

  // if (currentSongTime > firstTimeStamp || currentWordIndex === -1) {
  // console.log(currentSongTime, firstTimeStamp, currentLineData[currentWordIndex]?.lyric, currentWordIndex);
  if (currentSongTime > firstTimeStamp || currentWordIndex === -1) {
    currentWordIndex += addend;
  }
}

const fetch = () => {
  const currentWordData = currentLineData[currentWordIndex] || {}
  const firstTimeStamp = currentWordData?.time
  updateIndex(firstTimeStamp)
  
  return currentWordIndex
}

const setInitialCurrentWordIndex = () => {
  return  
}

const init = (params) => {
  const isForceCurrentIndex = params.isForceCurrentIndex
  currentLineIndex = params.currentLineIndex
  currentSongTime = params.currentSongTime
  parsedElrc = params.parsedElrc
  prevLineIndex = params.prevLineIndex
  currentWordIndex = params.currentWordIndex
  
  currentWordIndex = currentLineIndex === prevLineIndex || isForceCurrentIndex ? currentWordIndex : 0
  currentLineData = parsedElrc[currentLineIndex] || []

  return fetch()
} 

export default {
  init
};