<script setup>
import { ref, onMounted, computed } from 'vue'
import Button from 'primevue/button'
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox';
import Rating from 'primevue/rating';
import Menu from 'primevue/menu';
import { cleanHouse } from '@/stores/cleanHouse'
import { storeToRefs } from "pinia";

const cleanHouseStore = cleanHouse()
const updatingTaskId = ref(null)
const menu = ref();

const toggleMenu = (event, roomId) => {
  const element = menu.value.find(thing => thing.id === `overlay-${roomId}`)
  element.toggle(event);
};

const toggleCheckbox = async (task) => {
  updatingTaskId.value = task.id
  let response = await fetch(`http://127.0.0.1:3000/tasks/${ task.id }.json`, { 
    method: 'PUT', 
    headers: { 
      'Content-type': 'application/json'
    }, 
    body: JSON.stringify({
      date_completed: !task.is_complete ? new Date().toISOString() : null,
      is_complete: !task.is_complete,
    }) 
  }); 
  response = await response.json()

  updatingTaskId.value = null
  cleanHouseStore.updateLocalTask(response)
}

const roomRating = (room) => {
  const group = room.taskGroups[room.cleanLevel + 1] || []
  const completedLength = group.filter(task => task.is_complete).length
  const percentCompleted = completedLength / (group.length || 1)
  return room.cleanLevel * 20 + (percentCompleted * 20)
}

const setRoomGoal = async (room, goalLevel) => {
  let response = await fetch(`http://127.0.0.1:3000/rooms/${ room.id }.json`, { 
    method: 'PUT', 
    headers: { 
      'Content-type': 'application/json'
    }, 
    body: JSON.stringify({
      goal_level: goalLevel
    }) 
  }); 
  response = await response.json()
  cleanHouseStore.updateLocalRoom(room, goalLevel)
}

const timeSince = (date) => {
  const taskDate = new Date(date)
  var seconds = Math.floor((new Date() - taskDate) / 1000);
  var interval = seconds / 31536000;
  if(!date) return ''

  if (interval > 1) {
    return Math.floor(interval) + " years";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + " months";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + " days";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + " hours";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

onMounted(async () => {
  let response = await fetch('http://127.0.0.1:3000/rooms')
  response = await response.json()
  cleanHouseStore.addRoomsAndTasks(response)
})
</script>

<template>
  <div class='clean-house-container'>
    <div class="rooms-container">
      <Card v-for='room in cleanHouseStore.roomGroupedTasks' :key='room.id' :id='room.id' class='room'>
        
        <template #header>
          <div class="menu-container">
            <Button
              class='menu-button'
              type="button"
              icon="ri-more-2-line"
              @click="(event) => toggleMenu(event, room.id)"
              text
              aria-haspopup="true"
              aria-controls="overlay_menu"
            />
            <Menu ref="menu" :id="`overlay-${room.id}`" :model="[{
              label: `Room ${room.id}`,
              items: [
                { label: '★', command: () => { setRoomGoal(room, 1) } },
                { label: '★★', command: () => { setRoomGoal(room, 2) } },
                { label: '★★★', command: () => { setRoomGoal(room, 3) } },
                { label: '★★★★', command: () => { setRoomGoal(room, 4) } },
                { label: '★★★★★', command: () => { setRoomGoal(room, 5) } }
              ]
            }]" :popup="true" />
          </div>
          <img class='room-image' src="https://maidsailors.com/wp-content/uploads/2019/10/Why-You-Need-a-Clean-Bedroom-Maid-Sailors.jpg" />

        </template>
        <template #title><div class="room-name">{{ room.name }}</div></template>
        <template #subtitle>
          <div class="room-rating-container" :style='{ backgroundImage: `linear-gradient(to right, #10b981 ${ room.rating }%, white 0%)` }'>
            <span
              v-for="starIndex in 5"
              :key="starIndex"
              @click='setRoomGoal(room, starIndex)'
              class='room-star'
            >
              ★
            </span>
          </div>
        </template>
        <template #content>
          <div class="room-checklist">
            <div
              v-for="(taskGroup, index) of room.taskGroups"
              :key="index"
              :class="['room-taskgroup', { notInGoal: index > room.goal_level }]"
            >
              <h4 class='level-heading' @click='setRoomGoal(room, index)'>Level {{ index }}</h4>
              <div
                v-for="task of taskGroup"
                :key="task.id"
                :class="['room-task', { updating: updatingTaskId === task.id }]"
              >
                <Checkbox
                  v-model="room.completedTasks"
                  :inputId="task.id"
                  :name="task.name"
                  :value="task.id"
                  @update:modelValue='toggleCheckbox(task)'
                  :pt="{
                    box: 'check-box',
                    root: 'check-root',
                    icon: 'check-icon',
                  }"
                />
                <label class='task-label' :for="task.id">
                  {{ task.name }} 
                  <div v-if='task.date_completed' class="time-ago">{{ timeSince(task.date_completed) }} ago</div>
                </label>
              </div>
              <hr/>
            </div>
          </div>
        </template>
        <!-- <template #footer>
            <div class="flex gap-3 mt-1">
                <Button label="Cancel" severity="secondary" outlined class="w-full" />
                <Button label="Save" class="w-full" />
            </div>
        </template> -->
      </Card>
    </div>
    <div
      class="house-rating-container"

    >
      <div class="house-rating"
        :style='{
          backgroundImage: `linear-gradient(to right, #10b981 ${ cleanHouseStore.houseRating }%, transparent 0%)`
        }'
      >
        <span v-for="starIndex in 5" :key="starIndex" class='house-star'>★</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.clean-house-container {
  .rooms-container {
    overflow-x: scroll;
    display: flex;
    gap: 20px;

    .room {
      min-width: 25rem;
      overflow: hidden;
      position: relative;

      .menu-container {
        position: absolute;
        right: 0;

        .menu-button {
          color: white;
          font-size: 30px;
          text-shadow: 0px 1px 3px black;

          &:focus, &:hover {
            background: none;
          }
        }
      }

      .room-name {
        font-size: 20px;
        font-weight: 700;
      }
  
      .room-image {
        height: 210px;
        object-fit: cover;
        width: 100%;
      }
  
      .room-checklist {
        height: 300px;
        overflow-y: scroll;

        .level-heading {
          cursor: pointer;
          margin: 0;
        }

        .room-taskgroup {
          display: flex;
          flex-direction: column;
          gap: 10px;

          &.notInGoal {
            opacity: 0.2;
          }

          .room-task {
            display: flex;
            align-items: center;
            margin-bottom: 15px;

            .check-box {
              border-radius: 50%;
              width: 45px;
              height: 45px;
              transition: none;
            }

            .check-root {
              width: 45px;
              height: 45px;
            }

            .check-icon {
              width: 20px;
              height: 20px;
            }

            .task-label {
              width: 100%;
              padding: 14px;
              cursor: pointer;
              display: flex;
              flex-direction: column;

              .time-ago {
                color: rgb(174, 174, 174);
                font-size: 11px;
              }
            }

            &.updating:after {
              overflow: hidden;
              display: inline-block;
              vertical-align: bottom;
              animation: ellipsis steps(4, end) 1100ms infinite;
              content: '\2026'; /* ascii code for the ellipsis character */
              width: 0px;
            }

            @keyframes ellipsis {
              to {
                width: 1.25em;
              }
            }
          }
        }
      }
      .room-rating-container {
        display: flex;
        gap: 4px;
        background-size: 33.5%;
        background-clip: text;
        background-repeat: no-repeat;

        .room-star {
          -webkit-text-stroke: 1px #10b981;
          color: transparent;
          font-size: 20px;
          cursor: pointer;
        }
      }
    }
  }

  .house-rating-container {
    width: 100%;
    display: flex;
    justify-content: center;

    .house-rating {
      display: inline-flex;
      gap: 4px;
      justify-content: center;
      background-clip: text;
      background-repeat: no-repeat;

      .house-star {
        -webkit-text-stroke: 1px #10b981;
        color: transparent;
        font-size: 40px;
      }
    }
  }

}
</style>
