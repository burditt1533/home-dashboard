<script setup>
import { computed, ref, onMounted } from 'vue'
import { dashSettings } from '@/stores/dashSettings'
import { createFlickr } from 'flickr-sdk'
import Galleria from 'primevue/galleria'
import Dialog from 'primevue/dialog'
import VirtualScroller from 'primevue/virtualscroller'
import { albums } from './flickr.js'

// https://web.postman.co/workspace/My-Workspace~bc6426c2-1a09-43db-8e8c-014f85e206ce/request/35018135-f0abf98a-0d00-4281-b784-e59c58dd80f8?tab=params
// https://www.youtube.com/watch?v=VHeUDOY_Z6A&t=602s

const imageSrc = ref('')
const photos = ref([])
const settings = dashSettings()
const albumsData = ref([])
const isModalVisible = ref(false)

const activeIndex = ref(0)
const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 5
  },
  {
    breakpoint: '768px',
    numVisible: 3
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
])
const displayCustom = ref(false)
const { flickr } = createFlickr('a16300715463c75fdc492bc0c3574b3d')

const imageClick = (index) => {
  activeIndex.value = index
  displayCustom.value = true
}

onMounted(async () => {
  console.log(albums)

  // albumsData.value = albums

  // const res = await flickr("flickr.photosets.getList", {
  //     // photoset_id: '72177720315863913',
  //     user_id: '96024809@N06',
  //     oauth_consumer_key: 'a16300715463c75fdc492bc0c3574b3d',
  //     oauth_nonce: '9wQmoXWu0Em',
  //     oauth_signature: 'ESyvL9kCF0l67tHfyTv1561EtAk%3D',
  //     oauth_signature_method: 'HMAC-SHA1',
  //     oauth_token: "72157720918105555-4777bea59c9ec126",
  //     oauth_token_tecret: "55d520f9b1bc6910"
  // })

  // albums.value = res.photosets.photoset
})

const fetchAlbumImages = async (albumId) => {
  isModalVisible.value = true

  const res = await flickr('flickr.photosets.getPhotos', {
    photoset_id: albumId,
    per_page: 20,
    page: 1,
    user_id: '96024809@N06',
    oauth_consumer_key: 'a16300715463c75fdc492bc0c3574b3d',
    oauth_nonce: '9wQmoXWu0Em',
    oauth_signature: 'ESyvL9kCF0l67tHfyTv1561EtAk%3D',
    oauth_signature_method: 'HMAC-SHA1',
    oauth_token: '72157720918105555-4777bea59c9ec126',
    oauth_token_tecret: '55d520f9b1bc6910'
  })

  photos.value = res.photoset
}

const items = ref(Array.from({ length: 100000 }).map((_, i) => `Item #${i}`))
</script>

<template>
  <div class="photos-container">
    <VirtualScroller
      :items="albums"
      :itemSize="266"
      orientation="horizontal"
      :numToleratedItems="20"
      :appendOnly="true"
      style="height: 300px"
      class="images-container"
    >
      <template v-slot:item="{ item }">
        <div class="album-content" @click="fetchAlbumImages(item.id)">
          <img
            class="album-img"
            :src="`https://live.staticflickr.com/${item.server}/${item.primary}_${item.secret}.jpg`"
            alt="album"
          />
          <h4 class="album-title">{{ item.title._content }}</h4>
        </div>
      </template>
    </VirtualScroller>

    <Dialog
      v-model:visible="isModalVisible"
      modal
      dismissableMask
      :pt="{ root: 'p-dialog-maximized' }"
    >
      <h4 class="photos-title">{{ photos.title }}</h4>
      <div class="photos-container">
        <div
          v-for="(photo, index) in photos.photo"
          :key="photo.id"
          class="album-content"
          @click="imageClick(index)"
        >
          <img
            class="album-img"
            :src="`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`"
            alt="photo"
            style="cursor: pointer"
            @click="imageClick(index)"
          />
        </div>
      </div>
    </Dialog>

    <Galleria
      v-model:activeIndex="activeIndex"
      v-model:visible="displayCustom"
      :value="photos.photo"
      :responsiveOptions="responsiveOptions"
      :numVisible="7"
      containerStyle="max-width: 850px"
      :circular="true"
      :fullScreen="true"
      :showItemNavigators="true"
      :showThumbnails="false"
    >
      <template #item="slotProps">
        <img
          :src="`https://live.staticflickr.com/${slotProps.item.server}/${slotProps.item.id}_${slotProps.item.secret}.jpg`"
          :alt="slotProps.item.alt"
          style="width: 100%; display: block"
        />
      </template>
      <template #thumbnail="slotProps">
        <img
          :src="`https://live.staticflickr.com/${slotProps.item.server}/${slotProps.item.id}_${slotProps.item.secret}.jpg`"
          :alt="slotProps.item.alt"
          style="display: block"
        />
      </template>
    </Galleria>
  </div>
</template>

<style lang="scss">
.p-component-overlay {
  // background-color: rgba(0, 0, 0, 0.9);

  .p-dialog-maximized {
    background: rgb(0 0 0 / 90%);
    border: none;

    .p-dialog-content,
    .p-dialog-header {
      background: none;
    }
  }
}
</style>

<style scoped lang="scss">
.photos-container {
  width: 100%;
}
.images-container {
  padding: 50px 0;

  .album-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 25vw;
    height: 25vw;
    border: 1px solid #e7e7e7;
    border-radius: 5px;
    padding-top: 20px;
    margin: 0 20px;

    .album-img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      object-position: 50% 10%;
      border-radius: 3px;
      cursor: pointer;
    }

    .album-title {
      font-size: 13px;
      font-weight: bold;
      text-align: center;
      margin-top: 10px;
      color: #c87200;
    }
  }
}

.photos-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 50px;
  justify-content: center;
  gap: 20px;

  .album-content {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 25vw;
    height: 25vw;
    // border: 1px solid #e7e7e7;
    border-radius: 5px;
    padding-top: 20px;

    .album-img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      object-position: 50% 10%;
      border-radius: 3px;
      cursor: pointer;
    }

    .album-title {
      font-size: 13px;
      font-weight: bold;
      text-align: center;
      margin-top: 10px;
      color: #c87200;
    }
  }
}

.photos-title {
  text-align: center;
  font-size: 40px;
  color: $dash-c-white;
}
</style>
