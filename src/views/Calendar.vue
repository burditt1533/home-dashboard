<script setup>
  import { computed, ref, onMounted, watch } from 'vue'
  import FullCalendar from '@fullcalendar/vue3'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import { dashSettings } from '@/stores/dashSettings'
  import { dashCalendar } from '@/stores/dashCalendar'
  import Sidebar from 'primevue/sidebar';

  // https://fullcalendar.io/docs
  // https://developers.google.com/calendar/api/v3/reference
  // https://calendar.google.com/calendar/u/0/r

  const calendar = ref({})
  const sidecal = ref({})
  const settings = dashSettings()
  const useDashCalendar = dashCalendar()
  const isSidebarVisible = ref(false)
  const currentDay = ref({})

  watch(() => settings.isLoggedIn, () => {
    if (isFetchDates) {
      fetchGoogleCalendarEvents();
    }
  });

  const fetchGoogleCalendarEvents = () => {
    if (settings.isLoggedIn) {
      const today = new Date();
      // const firstDay = today.getDate() - today.getDay();
      const firstDay = today.getDate();
      const lastDay = firstDay + 21;
      const begOfWeek = new Date(today.setDate(firstDay))
      const endOfWeek = new Date(today.setDate(lastDay))

      fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?' + new URLSearchParams({
        timeMin:  begOfWeek.toISOString(),
        timeMax:  endOfWeek.toISOString()
      }), {
        headers: {
          'Authorization': `Bearer ${ settings.authInfo['access_token'] }`
        }
      })
      .then((data) => data.json())
      .then((response) => {
        if (!!response.error) {
          console.log(response.error)
        } else {
          useDashCalendar.addEvents(response.items)
        }
      })
    }
  }

  const handleDateClick = (arg) => {
    isSidebarVisible.value = true;
    currentDay.value = arg
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDay.value.headerDate = arg.date.toLocaleDateString("en-US", options);

    if (isFetchDates) {
      fetchGoogleCalendarEvents()
    }
  }

  const updateSideCalendar = () => {
    sidecal.value.calendar.changeView('timeGridFourDay', currentDay.value.dateStr);
  }

  const calendarOptions = computed(() => {
    return {
      plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
      // height: 350,
      // contentHeight: 600,
      initialView: 'dayGridMonth',
      dateClick: handleDateClick,
      events: useDashCalendar.googleEvents,
      allDay: false,
      dayHeaderFormat: { weekday: 'short', omitCommas: true },
      headerToolbar: {
        left: 'title,dayGridWeek,dayGridDay,dayGridMonth',
        // left: 'title',
        // center: '',
        // right: ''
      },
      eventClick: function(info) {
        console.log('Event: ' + info.event.title);

        // change the border color just for fun
        info.el.style.borderColor = 'red';
      }
    }
  })
  const sidebarCalendarOptions = computed(() => {
    return {
      plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
      height: 950,
      contentHeight: 600,
      initialView: 'timeGridFourDay',
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
      events: useDashCalendar.googleEvents,
      allDay: false,
      dayHeaderFormat: { weekday: 'short', month: 'numeric', day: 'numeric', omitCommas: true },
      headerToolbar: {
        left: '',
        // center: '',
        right: ''
      },
      eventClick: function(info) {
        console.log('Event: ' + info.event.title);

        // change the border color just for fun
        info.el.style.borderColor = 'red';
      }
    }
  })

  const isFetchDates = computed(() => {
    return settings.isLoggedIn && useDashCalendar.googleEvents.lengh === 0
  })

  onMounted(() => {
    fetchGoogleCalendarEvents();
  })
</script>

<template>
  <div class='calendar-section'>
    <FullCalendar v-if='!!calendarOptions' :options="calendarOptions" ref='calendar' />
    <Sidebar v-model:visible="isSidebarVisible" :header="currentDay.headerDate" @show='updateSideCalendar' :style="{width: '50vw'}">
      <FullCalendar v-if='!!sidebarCalendarOptions' :options="sidebarCalendarOptions" ref='sidecal' />
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

<style lang='scss'>

</style>
