import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import rooms from '@/components/CleanHouse/rooms/index.js'

export const cleanHouse = defineStore('cleanHouse', {
  state: () => ({
    rooms: rooms,
  }),
  getters: {
    roomGroupedTasks () {
      return rooms.map((room) => {
        const lowestIncompleteTask = room.tasks
          .sort((a, b) => a.points - b.points)
          .find((task) => !task.isComplete)

        room.taskGroups = Object.groupBy(room.tasks, ({ points }) => points) || []
        room.cleanLevel = lowestIncompleteTask.points - 1
        return room
      })
    }
  },
  actions: {
    // login() {
    //   this.isLoggedIn = true
    // },
  },
})