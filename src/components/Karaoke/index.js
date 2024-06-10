import billieLyrics from '@/assets/music/what-was-i-made-for.elrc?raw'
import billieJSON from '@/assets/music/what-was-i-made-for.json'
import usherLyrics from '@/assets/music/on-the-side.elrc?raw'
import usherJSON from '@/assets/music/on-the-side.json'
import allIAskLyrics from '@/assets/music/all-i-ask.elrc?raw'
import allIAskJSON from '@/assets/music/all-i-ask.json'
import fireLovinLyrics from '@/assets/music/fire-lovin.elrc?raw'
import fireLovinJSON from '@/assets/music/fire-lovin.json'
import icuLyrics from '@/assets/music/icu.elrc?raw'
import icuJSON from '@/assets/music/icu.json'

import billie from '@/assets/music/what-was-i-made-for.mp3'
import usher from '@/assets/music/on-the-side.mp3'
import allIAsk from '@/assets/music/all-i-ask.mp3'
import fireLovin from '@/assets/music/fire-lovin.mp3'
import icu from '@/assets/music/icu.mp3'

const convertTime = (time, prevTime) => {
  const first = time.replace('<', '').replace('>', '').replace('[', '').replace(']', '').split(':')
  const min = parseInt(first[0])
  const sec = parseInt(first[1].split('.')[0])
  const ms = parseInt(first[1].split('.')[1])

  const minSec = (min * 60 + parseInt(sec)) * 1000
  const onlyms = minSec + parseInt(ms)
  const timeUntilNext = onlyms / 1000 - prevTime

  return {
    current: onlyms / 1000,
    timeUntilNext
  }
}

const processLyrics = (rawElrc) => {
  const lyricLibrary = convertElrcToLibrary(rawElrc)

  return {
    lyricDump : createLyricDump(lyricLibrary)
  }
}

const convertElrcToLibrary = (lyric) => {
  let prevTime = 0
  var splitted = lyric.split(/\s+/g).map((item) => {
    if (item) return item
  })

  let lineThings = []
  let lineArray = []
  let lyricData = null
  let lineStartTime = null

  // splitted.unshift('<00:11.000>')
  // splitted.unshift('♫♫♫♫♫♫♫♫♫♫')
  // splitted.unshift('<00:01.000>')
  // splitted.unshift(' ')
  // splitted.unshift('[00:00.000]')

  let counter = 0

  splitted.forEach((text) => {
    if (text?.includes('[')) {
      const convertedStartTime = convertTime(text)
      const aLittleEarlier = convertedStartTime.current - 0.1
      lineStartTime = prevTime === 0 ? aLittleEarlier : convertedStartTime.current
      prevTime = prevTime === 0 ? convertedStartTime.current : prevTime

      let lyricHash2 = {
        time: lineStartTime,
        lyric: '[STARTOFLINE]',
        lineIndex: lineThings.length ,
        lyricIndex: counter,
        timeUntilNext: null
      }
      lineArray.push(lyricHash2)
      counter++

      lineThings.push(lineArray)
      lineArray = []
    }

    if (!text?.includes('<') && !text?.includes('[') && !!text) lyricData = text

    if (text?.includes('<')) {
      const convertedTime = convertTime(text, prevTime)

      let lyricHash = {
        time: counter === 0 ? lineStartTime : prevTime,
        lyric: lyricData,
        timeUntilNext: convertedTime.timeUntilNext
      }

      if (lineThings.length > 0) {
        lyricHash.lyricIndex = counter
        lyricHash.lineIndex = lineThings.length - 1
        counter++
      }

      lineArray.push(lyricHash)
      prevTime = convertedTime.current
    }
  })

  lineThings.push(lineArray)

  return lineThings
}

const createLyricDump = (lyrics) => {
  const lyricDump = []
  lyrics.forEach((line) => {
    line.forEach((lyric) => {
      lyricDump.push(lyric)
    })
  })

  return lyricDump
}

const songs = [
  {
    name: 'What Was I Made For',
    artist: 'Billie Eillish',
    url: billie,
    lyrics: processLyrics(billieLyrics),
    json: billieJSON,
    tempo: 79
  },
  {
    name: 'Fire Lovin',
    artist: 'Pleasure P',
    url: fireLovin,
    lyrics: processLyrics(fireLovinLyrics),
    json: fireLovinJSON,
    tempo: 93
  },
  {
    name: 'ICU',
    artist: 'Coco Jones',
    url: icu,
    lyrics: processLyrics(icuLyrics),
    json: icuJSON,
    tempo: 0
  },
  {
    name: 'All I Ask',
    artist: 'Adele',
    url: allIAsk,
    lyrics: processLyrics(allIAskLyrics),
    json: allIAskJSON,
    tempo: 71
  },
  {
    name: 'On the side',
    artist: 'Usher',
    url: usher,
    lyrics: processLyrics(usherLyrics),
    json: usherJSON,
    tempo: 94
  }
]

export default {
  songs
}
