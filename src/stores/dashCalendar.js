import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const dashCalendar = defineStore('dashCalendar', {
  state: () => ({
    googleEvents: []
  }),
  getters: {
    googleEventsIds: (state) => {
      return state.googleEvents.map((event) => event.id)
    },
  },
  actions: {
    addEvents(items) {
      items.forEach((item) => {
        if (!this.googleEventsIds.includes(item.id)) {
          this.googleEvents.push({
            id: item.id,
            title: item.summary, 
            start: item.start.date,
            end: item.end.dateTime
          })
        }
      })
    },
  },
})