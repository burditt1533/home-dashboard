<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Dialog from 'primevue/dialog'

const isModalVisible = ref(false);
const timeNow = ref(Date.now());
const seconds = ref(0);
const timeElapsed = ref('just now');
const currentStream = ref('');
const reloadInterval = ref(null);
const trainData = ref([
  {
    image: 'https://s70.ipcamlive.com/streams/46ry2sqb5cnij63wx/snapshot.jpg',
    street: 'Live Oak St.',
    id: '635c1059a967e',
    stream: 'https://g1.ipcamlive.com/player/player.php?alias=635c1059a967e&autoplay=1'
  },
  {
    image: 'https://s71.ipcamlive.com/streams/47gfarhzhpoamm8v3/snapshot.jpg',
    street: 'Willswood St.',
    id: '635c112681056',
    stream: 'https://g1.ipcamlive.com/player/player.php?alias=635c112681056&autoplay=1'
  },
  {
    image: 'https://s59.ipcamlive.com/streams/3b7q03jhs1aqvcrpf/snapshot.jpg',
    street: 'George St.',
    id: '635c0c64414c1',
    stream: 'https://g1.ipcamlive.com/player/player.php?alias=635c0c64414c1&autoplay=1'
  },
  {
    image: 'https://s23.ipcamlive.com/streams/173sceokunqtuj4dr/snapshot.jpg',
    street: 'Avondale Garden Rd.',
    id: '635c0abb11126',
    stream: 'https://g1.ipcamlive.com/player/player.php?alias=635c0abb11126&autoplay=1'
  },
])

const timeSince =  (date) => {
  seconds.value = Math.floor((new Date() - date) / 1000);
}

const updateTimeElapsed = () => {
  timeElapsed.value = timeSince(new Date(Date.now() - (Date.now() - timeNow.value)))
}

const updateImages = () => {
  timeNow.value = Date.now()
  timeElapsed.value = timeSince(new Date(Date.now() - (Date.now() - timeNow.value)))
}

const getNewImage = ({ id }) => {
  fetch(`https://ipcamlive.com/player/snapshot.php?alias=${id}`)
  .then(response => {
    trainData.value.find((train) => train.id === id).image = response.url
  })
}

const openStream = ({ stream }) => {
  currentStream.value = stream
  isModalVisible.value = true
}

const timeSinceText = computed(() => {
  let interval = seconds.value / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds.value / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds.value / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds.value / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds.value / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  if (interval < 0.1) {
    return 'just now'
  }
  
  return Math.floor(seconds.value) + " seconds ago";
})

const closeCallback = () => {
  console.log('closed')
}

onMounted(() => {
  updateTimeElapsed()
  reloadInterval.value = setInterval(() => {
    seconds.value >= 30 ? updateImages() : updateTimeElapsed()
  }, 10000)
})

onUnmounted(() => {
  clearInterval(reloadInterval.value)
})
</script>

<template>
  <div class="train-container">
    <Dialog
      v-model:visible="isModalVisible"
      dismissableMask modal 
      :pt="{
        root: 'video-modal',
      }"
    >
      <template #container='{ closeCallback }'>
        <iframe
          v-if='!!currentStream && isModalVisible'
          :src="currentStream"
          frameborder="0"
          class='train-video'
        />
        <h2 @click='closeCallback'></h2>
      </template>
    </Dialog>
    <div v-for='train in trainData' :key='train.id' class="train-info">
      <img
        :src="train.image + '?' + timeNow"
        class='train-image'
        @click='updateImages'
        @error='getNewImage(train)'
      />
      <h4 class='train-street' @click='openStream(train)'>{{ train.street }}</h4>
      <div class="time-passed">{{ timeSinceText }}</div>
    </div>
  </div>
</template>

<style  lang="scss">
.train-video {
  width: 100%;
  height: 530px;
}

.video-modal {
  width: 60rem;
  height: 530px;
  border-radius: 0;
  border: none;
}

.train-container {
  width: 100%;
  min-height: 108px;
  display: flex;
  background: $dash-c-card-bg;
  padding: 20px;
  gap: 5px;

  .train-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 25%;
    position: relative;

    .train-image {
      width: 100%;
      cursor: pointer;
      object-fit: contain;
    }
  
    .train-street {
      font-size: 18px;
      margin-top: 10px;
      cursor: pointer;
    }

    .time-passed {
      width: 100%;
      background: $dash-c-card-bg;
      position: absolute;
      bottom: 31px;
      font-size: 10px;
      text-align: center;
    }
  }
}
</style>
