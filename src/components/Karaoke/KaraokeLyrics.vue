<script setup>
  import { computed, ref, onMounted, watch } from 'vue'
  import getCurrentWordIndex from './getCurrentWordIndex.js'
  import KaraokeEditToolbar from './KaraokeEditToolbar.vue'
  import { karaoke } from '@/stores/karaoke'
  import { karaokeToolbar } from '@/stores/karaokeToolbar'

  const karaokeStore = karaoke()
  const karaokeToolbarStore = karaokeToolbar()
  const prevLineIndex = ref(0)
  const isForceCurrentIndex = ref(true)

  watch(
    () => karaokeStore.currentLyricTime,
    () => {
      const params = {
        currentLineIndex: karaokeStore.currentLineIndex,
        prevLineIndex: prevLineIndex.value,
        currentSongTime: karaokeStore.currentLyricTime,
        parsedElrc: displayedLyrics.value,
        currentWordIndex: karaokeStore.currentWordIndex,
        isForceCurrentIndex: isForceCurrentIndex.value
      }
      prevLineIndex.value = karaokeStore.currentLineIndex
      karaokeStore.set('currentWordIndex', getCurrentWordIndex.init(params))
      isForceCurrentIndex.value = false
    }
  )

  const displayedLyrics = computed(() => {
    return karaokeStore.currentSong.lyrics.reformatted
  })

  const formattedLyrics = computed(() => {
    const lyricLine = displayedLyrics.value[karaokeStore.currentLineIndex] || []
    return karaokeStore.isSingleLyricLine ? [lyricLine] : displayedLyrics.value
  })

  const isMusicStarted = computed(() => {
    return karaokeStore.musicPlayer.currentTime > 0
  })

  const currentLyricElement = computed(() => {
    return document.getElementById('lyric-' + karaokeStore.currentLineIndex)
  })

  const goToCurrentLyric = (newLineIndex) => {
    karaokeStore.set('currentLineIndex', newLineIndex)
    if (karaokeStore.isEditMode) {
      currentLyricElement.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  }

  const selectModifiedLyric = (lineIndex, wordIndex, isModifyStartTime) => {
    const kts = karaokeToolbarStore
    isForceCurrentIndex.value = true
    kts.set('currentModifiedLineIndex', lineIndex)
    kts.set('currentModifiedLyricIndex', wordIndex)
    kts.set('isModifyStartTime', isModifyStartTime)
    karaokeStore.set('currentLineIndex', lineIndex)
    karaokeStore.set('currentWordIndex', wordIndex)

    const lyricToHear = kts.isModifyStartTime ? kts.previousModifiedLyric : kts.currentModifiedLyric

    karaokeStore.setPlaybackPosition(lyricToHear.time)
  }
</script>

<template>
  <div>
    <div :class="['lyric-container', { single: karaokeStore.isSingleLyricLine }]">
      <div v-if="!karaokeStore.currentSong.name" class="music-info">Choose A Song</div>
      <template v-else-if="isMusicStarted">
        <div
          v-for="(line, lineIndex) in formattedLyrics"
          :key="line.time"
          :class="[
            'lyric-wrap',
            {
              current: lineIndex === karaokeStore.currentLineIndex || karaokeStore.isSingleLyricLine
            },
            { editMode: karaokeStore.isEditMode }
          ]"
          :id="'lyric-' + lineIndex"
        >
          <span
            v-if="karaokeStore.isEditMode"
            class="smaller"
            @click="selectModifiedLyric(lineIndex, 0, true)"
          >
            {{ line[0].lineStartData.toFixed(3) }}
          </span>

          <span
            v-for="(word, wordIndex) in line"
            :key="wordIndex"
            :style="{ transitionDuration: karaokeStore.isEditMode ? 0 : `${word.timeUntilNext}s` }"
            :class="[
              'lyric',
              {
                highlight:
                  `${lineIndex}-${wordIndex}` ===
                  `${karaokeStore.isSingleLyricLine ? 0 : karaokeStore.currentLineIndex}-${karaokeStore.currentWordIndex}`
              },
              { modifiying: word.time === karaokeToolbarStore.currentModifiedLyric.time }
            ]"
            @click="selectModifiedLyric(lineIndex, wordIndex, false)"
          >
            <div class="stacked-lyric">
              <span>{{ word.lyric + ' ' }}</span>
              <span :class="['smaller', { modified: karaokeToolbarStore.modifiedLyrics.includes(word) }]">{{
                word.time.toFixed(3)
              }}</span>
            </div>
          </span>
        </div>
      </template>

      <div v-else-if="karaokeStore.countdownNumber < 4" class="countdown">
        {{ karaokeStore.countdownNumber }}
      </div>

      <div v-else class="music-info">
        <div>{{ karaokeStore.currentSong.artist }}</div>
        <div>{{ karaokeStore.currentSong.name }}</div>
      </div>
    </div>
  </div>

  <KaraokeEditToolbar> </KaraokeEditToolbar>
</template>

<style lang="scss">
.lyric-container {
  background: $dash-c-card-bg;
  width: 100%;
  // height: 70vh;
  height: 60vh;
  overflow: scroll;
  padding: 120px 20px;

  .lyric-wrap {
    color: white;
    font-size: 40px;
    opacity: 0.2;
    text-align: center;
    margin-bottom: 50px;
    line-break: anywhere;
    transform: scale(0.7);
    transition:
      opacity 700ms,
      transform 300ms;
    display: flex;
    justify-content: center;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;

    .smaller {
      font-size: 12px;
      cursor: pointer;

      &.modified {
        color: orange;
      }
    }

    &.editMode {
      transform: scale(1);
      opacity: 1;
      transition: none;
    }

    .stacked-lyric {
      display: inline-flex;
      flex-direction: column;
    }

    .lyric {
      background-size: 100%;
      transition-property: background-size;
      background-clip: text;
      background-repeat: no-repeat;
      background-image: linear-gradient(to right, orange 100%, white 1%);
      cursor: pointer;

      &.modifiying {
        color: orange;
        transition-duration: 0ms !important;
      }
    }

    &.current {
      transform: scale(1);
      opacity: 1;

      .lyric {
        &.highlight {
          color: transparent;
          background-image: linear-gradient(to right, orange 001%, white 1.2%);
          background-size: 10000%;
        }
      }
    }
  }

  .music-info {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 30vh;
    font-size: 30px;
  }

  .countdown {
    font-size: 176px;
    font-weight: bold;
    opacity: 0.6;
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
  }

  &.single {
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .lyric {
      opacity: 1;
      margin-bottom: 0;
    }
  }
}
</style>
