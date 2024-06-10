<script setup>
  import { computed, ref, onMounted, watch } from 'vue'
  import getCurrentWordIndex from './getCurrentWordIndex.js'
  import KaraokeEditToolbar from './KaraokeEditToolbar.vue'
  import { karaoke } from '@/stores/karaoke'
  import { karaokeToolbar } from '@/stores/karaokeToolbar'

  const karaokeStore = karaoke()
  const karaokeToolbarStore = karaokeToolbar()

  watch(() => karaokeStore.currentLyricTime, () => {
    karaokeStore.getCurrentWordIndex()
  })

  const displayLyrics = computed(() => {
    const lyricLine = karaokeStore.groupedLyrics[karaokeStore.currentLineIndex] || []
    return karaokeStore.isSingleLyricLine ? [lyricLine] : karaokeStore.groupedLyrics
  })

  const isMusicStarted = computed(() => {
    return karaokeStore.musicPlayer.currentTime > 0
  })

  const currentLyricElement = computed(() => {
    return document.getElementById('lyric-' + karaokeStore.currentLineIndex)
  })

  const goToCurrentLyric = (newLineIndex) => {
    if (!karaokeStore.isEditMode) {
      currentLyricElement.value?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    }
  }

  const selectModifiedLyric = (lyric) => {
    const kts = karaokeToolbarStore
    kts.set('currentModifiedLyricIndex', lyric.lyricIndex)
    karaokeStore.set('currentWordIndex', lyric.lyricIndex)

    karaokeStore.setPlaybackPosition(kts.lyricToHear)
  }
</script>

<template>
  <div>
    <div :class="['lyric-container', { single: karaokeStore.isSingleLyricLine }]">
      <div v-if="!karaokeStore.currentSong.name" class="music-info">Choose A Song</div>
      <template v-else-if="isMusicStarted">
        <div
          v-for="(line, lineIndex) in displayLyrics"
          :key="line.time"
          :class="[
            'lyric-wrap',
            {
              current: parseInt(lineIndex) === karaokeStore.currentLineIndex || karaokeStore.isSingleLyricLine
            },
            { editMode: karaokeStore.isEditMode }
          ]"
          :id="'lyric-' + lineIndex"
        >
          <span
            v-for="(word, wordIndex) in line"
            :key="wordIndex"
            :style="{ transitionDuration: karaokeStore.isEditMode ? 0 : `${word.timeUntilNext}s` }"
            :class="[
              'lyric',
              { highlight: word.lyricIndex === karaokeStore.currentWordIndex - 1 && !karaokeToolbarStore.isClickEditMode },
              { modifiying: word.time === karaokeToolbarStore.currentModifiedLyric.time  },
              { cursorEdit: word.lyricIndex === karaokeToolbarStore.editCursor && karaokeToolbarStore.isClickEditMode},
            ]"
            @click="selectModifiedLyric(word)"
          >
            <div v-if="word.lyric !== '[STARTOFLINE]' || karaokeStore.isEditMode" class="stacked-lyric">
              <span>{{ word.lyric + ' ' }}</span>
              <span v-if='karaokeStore.isEditMode' :class="[
                  'smaller',
                  { modified: karaokeToolbarStore.modifiedLyrics.includes(word) }
                ]"
              >
                {{ word.time.toFixed(3)}}
              </span>
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

  <KaraokeEditToolbar v-if='karaokeStore.isEditMode'> </KaraokeEditToolbar>
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

      &.cursorEdit {
        color: #0ea5e9;
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
