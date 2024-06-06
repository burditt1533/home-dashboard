<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import { dashSettings } from '@/stores/dashSettings'
import { dashCalendar } from '@/stores/dashCalendar'
import Sidebar from 'primevue/sidebar'

// https://fullcalendar.io/docs
// https://developers.google.com/calendar/api/v3/reference
// https://calendar.google.com/calendar/u/0/r

const calendar = ref({})
const sidecal = ref({})
const settings = dashSettings()
const isSidebarVisible = ref(false)
const currentDay = ref({})

const useDashCalendar = dashCalendar()

watch(
  () => dashSettings().isLoggedIn,
  () => {
    fetchGoogleCalendarEvents()
  }
)

const fetchGoogleCalendarEvents = () => {
  if (settings.isLoggedIn) {
    const calendarId =
      'a8645bc418bc310ca9bf986012a18d087207d79258480a6c124c0293eaf2035b@group.calendar.google.com'
    const today = new Date()
    // const firstDay = today.getDate() - today.getDay();
    const firstDay = today.getDate()
    const lastDay = firstDay + 21
    const begOfWeek = new Date(today.setDate(firstDay))
    const endOfWeek = new Date(today.setDate(lastDay))

    fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?` +
        new URLSearchParams({
          timeMin: begOfWeek.toISOString(),
          timeMax: endOfWeek.toISOString()
        }),
      {
        headers: {
          Authorization: `Bearer ${settings.authInfo['access_token']}`
        }
      }
    )
      .then((data) => data.json())
      .then((response) => {
        if (!!response.error) {
          console.log(response.error)
        } else {
          console.log(response.items)
          useDashCalendar.addEvents(response.items)
        }
      })
  }
}

const handleDateClick = (arg) => {
  // console.log(calendar.value.calendar.currentData.viewTitle)
  isSidebarVisible.value = true
  currentDay.value = arg
  var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  currentDay.value.headerDate = arg.date.toLocaleDateString('en-US', options)
  // fetchGoogleCalendarEvents()
}

const updateSideCalendar = () => {
  sidecal.value.calendar.changeView('timeGridFourDay', currentDay.value.dateStr)
}

const calendarOptions = computed(() => {
  return {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    height: 350,
    contentHeight: 600,
    // aspectRatio: 3,
    // initialView: 'dayGridWeek',
    initialView: 'dayGrid',
    // initialDate: "2024-05-18",
    // initialView: 'timeGridFourDay',
    dayCount: 30,
    dateClick: handleDateClick,
    events: useDashCalendar.googleEvents,
    allDay: false,
    dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
    headerToolbar: {
      // left: 'dayGridMonth,dayGridWeek,dayGridDay,title',
      // left: 'title',
      left: '',
      // center: '',
      right: ''
    },
    eventClick: function (info) {
      console.log('Event: ' + info.event.title)

      // change the border color just for fun
      info.el.style.borderColor = 'red'
    }
  }
})
const sidebarCalendarOptions = computed(() => {
  return {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    height: 950,
    contentHeight: 600,
    // aspectRatio: 3,
    // initialView: 'dayGridWeek',
    initialView: 'timeGridFourDay',
    // initialView: 'timeGridFourDay',
    views: {
      timeGridFourDay: {
        type: 'timeGrid',
        duration: { days: 1 },
        allDaySlot: false
      },
      dayGridMonth: {
        type: 'dayGrid',
        duration: { days: 15 }
      }
    },
    // dateClick: handleDateClick,
    events: useDashCalendar.googleEvents,
    allDay: false,
    dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
    headerToolbar: {
      left: '',
      // center: '',
      right: ''
    },
    eventClick: function (info) {
      console.log('Event: ' + info.event.title)

      // change the border color just for fun
      info.el.style.borderColor = 'red'
    }
  }
})

const calendarTitle = computed(() => {
  return calendar.value.calendar.currentData.viewTitle
})

onMounted(() => {})
</script>

<template>
  <div class="calendar-section">
    <h4 v-if="!!calendar.calendar" class="calendar-heading">{{ calendarTitle }}</h4>
    <div class="calendar-container">
      <div class="calendar-scroll">
        <FullCalendar v-if="!!calendarOptions" :options="calendarOptions" ref="calendar" />
      </div>
    </div>
    <Sidebar
      v-model:visible="isSidebarVisible"
      :header="currentDay.headerDate"
      @show="updateSideCalendar"
      :style="{ width: '50vw' }"
    >
      <FullCalendar
        v-if="!!sidebarCalendarOptions"
        :options="sidebarCalendarOptions"
        ref="sidecal"
      />
    </Sidebar>
    <!-- <iframe 
        src="https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FChicago&bgcolor=%23ffffff&showTitle=0&showNav=0&showPrint=0&showTz=0&showCalendars=0&showDate=0&src=cGhpbGVhc3kyMDAyQGdtYWlsLmNvbQ&src=YWRkcmVzc2Jvb2sjY29udGFjdHNAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&src=ZmFtaWx5MTc1OTE5MTExNjA2OTExMzM4MTZAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&src=ZW4udXNhI2hvbGlkYXlAZ3JvdXAudi5jYWxlbmRhci5nb29nbGUuY29t&color=%234285F4&color=%23F6BF26&color=%237986CB&color=%23009688"
        style="border-width:0"
        width="800"
        height="600"
        frameborder="0"
        scrolling="no"
      >
      </iframe> -->
  </div>
</template>

<style lang="scss">
.calendar-section {
  // background: $dash-c-card-bg;

  .calendar-heading {
    font-size: 30px;
    text-align: center;
    color: $dash-c-white;
    background: $dash-c-card-bg;
    padding: 10px;
    margin-bottom: $dash-c-home-gap;
  }
  .calendar-container {
    overflow: scroll;

    .calendar-scroll {
      width: 500vw;
    }
  }

  .fc .fc-scrollgrid,
  .fc-theme-standard td,
  .fc-theme-standard th {
    border: 1px solid rgba(88, 88, 88, 0.197);
    border-top: none;
  }

  .fc .fc-daygrid-day.fc-day-today,
  .fc-view-harness {
    background-color: $dash-c-card-bg;
  }

  .fc-col-header-cell.fc-day-today {
    background-color: $dash-c-card-bg;
  }

  .fc-scrollgrid-sync-inner {
    color: $dash-c-white;
    padding: 12px 0;
  }

  .fc-header-toolbar {
    color: $dash-c-white;
    display: none;
  }

  .fc-scrollgrid-sync-inner {
    a {
      color: $dash-c-white;
    }
  }
}
</style>
