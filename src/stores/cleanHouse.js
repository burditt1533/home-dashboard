import { defineStore } from 'pinia'
// import rooms from '@/components/CleanHouse/rooms/index.js'

export const cleanHouse = defineStore('cleanHouse', {
  state: () => ({
    rooms: [],
    tasks: [],
    isLocal: false
  }),
  getters: {
    serverUrl () {
      return this.isLocal ? 'http://127.0.0.1:3000' : 'https://home-dashboard-backend.onrender.com'
    },
    roomsWithTasks () {
      return this.rooms.map((room) => {
        room.tasks = this.tasks.filter(task => task.room_id === room.id)
                               .sort((a, b) => a.level - b.level)
        return room
      })
    },
    roomGroupedTasks () {
      return this.roomsWithTasks.map((room) => {
        const allOrNone = room.tasks.some(task => task.is_complete) ? 5 : 0
        const lowestincompleteTask = room.tasks.find((task) => !task.is_complete)
        room.taskGroups = Object.groupBy(room.tasks, ({ level }) => level) || []
        room.cleanLevel = !!lowestincompleteTask ? lowestincompleteTask.level - 1 : allOrNone
        room.rating = this.getRoomRating(room)

        return room
      })
    },
    houseRating () {
      const roomRatings = this.roomGroupedTasks.map((room) => room.rating)
      const sum = roomRatings.reduce((partialSum, a) => partialSum + a, 0);
      return sum / roomRatings.length
    }
  },
  actions: {
    set(property, value) {
      this[property] = value
    },
    addRoomsAndTasks({ rooms, tasks }) {
      this.tasks = tasks
      rooms.map(this.addCompletedTasks)
      this.rooms = rooms
    },
    addCompletedTasks (room) {
      room.completedTasks = this.tasks.filter((task) => task.is_complete)
                                      .map(task => task.id)
    },
    undoLocalTask (task) {
      const index = this.completedTasks.indexOf(task.id);
      this.completedTasks.splice(index, 1);
    },
    updateLocalTask (updatedTask) {
      this.tasks.find(task => {
        if (task.id === updatedTask.id) {
          task.is_complete = updatedTask.is_complete,
          task.date_completed = updatedTask.date_completed
          return true 
        }
      })
    },
    updateLocalRoom (updatedRoom, level) {
      const localRoom = this.rooms.find(room => room.id === updatedRoom.id)
      localRoom.goal_level = level
    },
    getRoomRating (room) {
      const group = room.taskGroups[room.cleanLevel + 1] || []
      const completedLength = group.filter(task => task.is_complete).length
      const percentCompleted = completedLength / (group.length || 1)
      return room.cleanLevel * 20 + (percentCompleted * 20)
    },
    timeSince (date) {
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
  },
})