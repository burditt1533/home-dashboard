<script setup>
import { ref, onMounted } from 'vue'

const time = ref('')
const date = ref('')
const timerID = ref(null)

const week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

onMounted(() => {
  timerID.value = setInterval(updateTime, 1000)
  updateTime()
})

const hours12 = (inputHrs) => {
  let hours = inputHrs
  if (hours > 12) {
    hours -= 12
  } else if (hours === 0) {
    hours = 12
  }
  return hours
}

const updateTime = () => {
  const cd = new Date()
  const hours = hours12(cd.getHours())
  time.value =
    zeroPadding(hours, 2) +
    ':' +
    zeroPadding(cd.getMinutes(), 2) +
    ':' +
    zeroPadding(cd.getSeconds(), 2)
  date.value =
    week[cd.getDay()] +
    ' ' +
    zeroPadding(cd.getMonth() + 1, 2) +
    '/' +
    zeroPadding(cd.getDate(), 2) +
    '/' +
    zeroPadding(cd.getFullYear(), 4)
}

const zeroPadding = (num, digit) => {
  let zero = ''
  for (var i = 0; i < digit; i++) {
    zero += '0'
  }
  return (zero + num).slice(-digit)
}
</script>

<template>
  <div id="clock">
    <p class="date">{{ date }}</p>
    <p class="time">{{ time }}</p>
  </div>
</template>

<style scoped lang="scss">

#clock {
  font-family: 'Share Tech Mono', monospace;
  color: $dash-c-white;
  background: $dash-c-card-bg;
  text-align: center;
  left: 50%;
  top: 50%;
  // text-shadow:
  //   0 0 20px rgba(10, 175, 230, 1),
  //   0 0 20px rgba(10, 175, 230, 0);
  padding-top: 40px;

  p {
    margin: 0;
    padding: 0;
  }
  .time {
    letter-spacing: 0.05em;
    font-size: 80px;
    padding: 5px 0;
  }

  .date {
    letter-spacing: 0.1em;
    font-size: 24px;
  }

  .text {
    letter-spacing: 0.1em;
    font-size: 12px;
    padding: 20px 0 0;
  }

  @media(max-width: 500px) {
    .time {
      font-size: 40px;
    }
  }
}
</style>
