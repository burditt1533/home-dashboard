import billieLyrics from '@/assets/music/what-was-i-made-for.elrc?raw'
import usherLyrics from '@/assets/music/on-the-side.elrc?raw'
import allIAskLyrics from '@/assets/music/all-i-ask.elrc?raw'
import swvLyrics from '@/assets/music/swv.lrc?raw'
import rapGodLyrics from '@/assets/music/rap-god.lrc?raw'
import fireLovinLyrics from '@/assets/music/fire-lovin.elrc?raw'

import billie from '@/assets/music/what-was-i-made-for.mp3'
import usher from '@/assets/music/on-the-side.mp3'
import allIAsk from '@/assets/music/all-i-ask.mp3'
import swv from '@/assets/music/swv.mp3'
import rapGod from '@/assets/music/rap-god.mp3'
import fireLovin from '@/assets/music/fire-lovin.mp3'
import { Lrc } from 'lrc-kit'

const processLyrics = (lyric) => {
  const raw = formatLyrics(lyric)
  let formatted = processElrc(raw)
  const reformatted = processElrc2(lyric)

  raw.lyrics[0].content = ` <00:01.0> ♫♫♫♫♫♫♫♫♫♫ <00:${formatted[1][0].time + 1 }>`
  formatted = processElrc(raw)
  return {
    raw,
    formatted,
    reformatted
  }
}

const formatLyrics = (lyrics) => {
  const lrc = Lrc.parse(lyrics)
  lrc.lyrics = [
    { timestamp: 0.5001, content: ' <00:01.0> ♫♫♫♫♫♫♫♫♫♫ <00:11.00>' },
    ...lrc.lyrics
  ]
  return lrc;
}

const convertTime = (time, prevTime) => {
  const first = time.replace('<', '').replace('>', '').replace('[', '').replace(']', '').split(':')
  const min = parseInt(first[0])
  const sec = parseInt(first[1].split('.')[0])
  const ms = parseInt(first[1].split('.')[1])

  const minSec = (min * 60 + parseInt(sec)) * 1000
  const onlyms =  minSec + parseInt(ms)
  const timeUntilNext = onlyms/1000 - prevTime;

  return {
    current: onlyms / 1000,
    timeUntilNext
  }
}

const processElrc2 = (lyric) => {
  let prevTime = 0;
  var splitted = lyric.split(/\s+/g).map((item) => {
    if (item) return item;
  });

  let lineThings = []
  let lineArray = []
  let lyricData = null
  let lineStartData = null
  let lineIndex = -1

  splitted.unshift('<00:11.000>')
  splitted.unshift('♫♫♫♫♫♫♫♫♫♫')
  splitted.unshift('<00:01.000>')
  splitted.unshift(' ')
  splitted.unshift('[00:00.000]')

  splitted.forEach(text => {
    if (text?.includes('[')) {
      lineStartData = convertTime(text).current
      lineIndex++
      if(lineArray.length) lineThings.push(lineArray)
      lineArray = []
    }
    if(!text?.includes('<') && !text?.includes('[') && !!text) lyricData = text
    if (text?.includes('<')) {
      const convertedTime = convertTime(text, prevTime)

      lineArray.push({
        time: convertedTime.current,
        lyric: lyricData,
        lineStartData: lineStartData,
        timeUntilNext: convertedTime.timeUntilNext
      })

      prevTime = convertedTime.current
    }
  })
  if(lineArray.length) lineThings.push(lineArray)

  // const groupedTimes = Object.groupBy(lineThings, ({ lineStartData }) => lineStartData);

  return lineThings
}

const processElrc = (parsedLrc) => {
  let prevTime = 0;
  return parsedLrc.lyrics.map((line) => line.content
    .replaceAll('<', '')
    .split('> ')
    .map(lyric => {
      const split = lyric.split(' ');
      const minutes = split[1]?.replace('>', '').split(':')[0];
      const seconds = split[1]?.replace('>', '').split(':')[1].split('.')[0];
      const ms = split[1]?.replace('>', '').split('.')[1];

      const minSec = (minutes * 60 + parseInt(seconds)) * 1000
      const onlyms =  minSec + parseInt(ms)
      const timeUntilNext = onlyms / 1000 - prevTime;


      prevTime = onlyms / 1000

      // console.log({
      //   lyric: split[0],
      //   time: onlyms/1000,
      //   timeUntilNext: timeUntilNext
      // })
      
      return {
        lyric: split[0],
        time: onlyms/1000,
        timeUntilNext: timeUntilNext
      }
    })
  )
}

const songs = [
  {
    name: 'What Was I Made For',
    artist: 'Billie Eillish',
    url: billie,
    lyrics: processLyrics(billieLyrics),
    tempo: 79
  },
  {
    name: 'Fire Lovin',
    artist: 'Pleasure P',
    url: fireLovin,
    lyrics: processLyrics(fireLovinLyrics)
  },
  // {
  //   name: 'Youre always on my mind',
  //   artist: 'SWV',
  //   url: swv,
  //   lyrics: processLyrics(swvLyrics)
  // },
  {
    name: 'All I Ask',
    artist: 'Adele',
    url: allIAsk,
    lyrics: processLyrics(allIAskLyrics),
    tempo: 71
  },
  {
    name: 'On the side',
    artist: 'Usher',
    url: usher,
    lyrics: processLyrics(usherLyrics),
    tempo: 94
  }
]

export default {
  songs
};