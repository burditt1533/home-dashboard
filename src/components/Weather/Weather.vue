<script setup>
  import { ref, onMounted } from 'vue'
  import WeatherCode from './weatherCode.json'
  import WeatherHourly from './WeatherHourly.vue'

  // https://open-meteo.com/en/docs#current=relative_humidity_2m,is_day,cloud_cover,wind_speed_10m&precipitation_unit=inch
  // https://gist.githubusercontent.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c/raw/76b0cb0ef0bfd8a2ec988aa54e30ecd1b483495d/descriptions.json
  
  const weather = ref({})
  const weatherCodeData = ref({})
  const hourlyData = ref(null)
  const isHourlyVisible = ref(false);

  onMounted(() => {
    fetch(
      'https://api.open-meteo.com/v1/forecast?' +
        new URLSearchParams({
          latitude: '29.950549',
          longitude: '-90.247931',
          current:
            'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,wind_speed_10m,cloud_cover,rain,is_day,weather_code,precipitation',
          temperature_unit: 'fahrenheit',
          wind_speed_unit: 'mph',
          precipitation_unit: 'inch',
          timezone: 'America/Chicago',
          hourly: 'temperature_2m,relative_humidity_2m,is_day,precipitation_probability,weather_code,wind_speed_10m'
        })
    ).then(async (response) => {
      weather.value = await response.json()
      weatherCodeData.value = WeatherCode[weather.value.current.weather_code]
      hourlyData.value = weather.value.hourly
    })
  })
</script>

<template>
  <div class="weather-container">
    <div v-if="weather.current" class="weather-content" @click='isHourlyVisible = !isHourlyVisible'>
      <!-- {{ weather.current }} -->
      <div class="left-side">
        <div class="icon-container">
          <img :src="weatherCodeData.day.image" />

          <!-- <i class="ri-sun-line"></i> -->
        </div>
        <div class="temperature-container">
          {{ parseInt(weather.current.apparent_temperature) }}
          <i class="ri-fahrenheit-fill"></i>
        </div>
        <ul class="stats-container">
          <li>Precipication: {{ weather.current.precipitation_probability }}%</li>
          <li>Humidity: {{ weather.current.relative_humidity_2m }}%</li>
          <li>Wind: {{ weather.current.wind_speed_10m }}mph</li>
        </ul>
      </div>

      <ul class="right-side">
        <!-- <li>Weather </li> -->
        <li class="city-name">Waggaman, LA</li>
        <li>{{ weatherCodeData.day.description }}</li>
      </ul>
    </div>

    <div :class="['hourly-hider', {'in': isHourlyVisible }]">
      <WeatherHourly v-if='!!hourlyData' :hourlyData='hourlyData'/>
    </div>
  </div>
</template>

<style lang="scss">
.hourly-modal {
  width: 80%;
  // height: 500px;
  background: $dash-c-card-bg;
  border: none;
  border-radius: 0;

  .p-dialog, .p-dialog-content {
    background: transparent;
  }

  .p-dialog-header {
    display: none;
    
  }
}
</style>
<style scoped lang="scss">
.weather-container {
  background: $dash-c-card-bg;
  color: $dash-c-white;
  padding: 10px 10px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  min-height: 142px;
  flex-wrap: wrap;

  .weather-content {
    width: 90%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    .left-side {
      display: flex;
      align-items: center;
    }

    .right-side {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 18px;
      list-style: none;

      .city-name {
        font-size: 32px;
      }
    }
  }

  .temperature-container {
    margin: 0 15px;
  }

  .icon-container {
    /* font-size: 30px; */
  }

  .stats-container {
    font-size: 13px;
    list-style: none;
  }

  .hourly-hider {
    height: 0;
    overflow: hidden;
    transition: height 400ms;

    &.in {
      height: 340px;
    }
  }
}
</style>
