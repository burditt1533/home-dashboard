<script setup>
  import { ref, onMounted } from 'vue'
  import WeatherCode from './weatherCode.json'

  const results = ref({});
  const props = defineProps({
    hourlyData: {
      type: Object,
      required: true
    }
  });

  const checkDate = (checkDate) => {
    const date = new Date();
    const now = new Date(date.setHours(date.getHours() - 2))
    const then = new Date(date.setDate(date.getDate() + 1))
    return checkDate > now && checkDate < then
  }

  results.value = props.hourlyData.time.map((data, index) => {
    const date = new Date(Date.parse(data))
    const isDay = props.hourlyData.is_day[index]
    const dayOrNight = isDay ? 'day' : 'night'
    if (checkDate(date)) {
      return {
        time: props.hourlyData.time[index],
        temperature: props.hourlyData.temperature_2m[index],
        humidity: props.hourlyData.relative_humidity_2m[index],
        wind: props.hourlyData.wind_speed_10m[index],
        precipitation: props.hourlyData.precipitation_probability[index],
        weatherCode: WeatherCode[props.hourlyData.weather_code[index]][dayOrNight].image
      }
    }
  }).filter(n => n);

  const getHours = (dateString) => {
    const date = new Date(Date.parse(dateString))
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ' ' + ampm;
    return strTime;
  }

  onMounted(() => {

  });
</script>

<template>
  <div class='hourly-container'>
    <div class="scroll-container">
    <div v-for='(hour) in results' :key='hour' class='fields-container' >
        <!-- <div class="temperature" :style='{backgroundImage: `linear-gradient(to top, green 0% ${hour.temperature}%, white ${hour.temperature}% 100%)`}'>
        </div> -->
        <div class="temperature" :style='{ height: `${hour.temperature}%` }'>
          <div class='field'>{{ hour.temperature }}°</div>
          <div class='field'>
            <img :src="hour.weatherCode" class='weather-image' />
            <div>{{ hour.precipitation }}%</div>
          </div>
          <div class='field'>{{ getHours(hour.time) }}</div>
        </div>
        <!-- <div class='field'>Wind: {{ hour.wind }}mph</div>
        <div class='field'>Humidity: {{ hour.humidity }}</div> -->
    </div>
    </div>
  </div>
</template>

<style scoped lang='scss'>
  .hourly-container {
    width: 100%;
    overflow: scroll;

    .scroll-container {
      display: flex;
      gap: 10px;
    }

    .fields-container {
      width: 280px;
      height: 340px;
      display: flex;
      flex-direction: column;
          justify-content: flex-end;
      gap: 10px;
      // border: 1px solid black;
      margin-bottom: 20px;
      border-radius: 4px;
      position: relative;

      .temperature {
        height: 100%;
        width: 100px;
        background-image: linear-gradient(to top, green 0px, yellow 50%, red 100%);
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
        font-size: 16px;
        border-radius: 10px 10px 0 0;
        padding: 15px;
      }

      .field {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-weight: 600;
      }

      .weather-image {
        width: 60px;
      }
    }
  }
</style>
