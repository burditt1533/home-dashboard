<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'primevue/chart'

const chartData = ref()
const chartOptions = ref()

onMounted(() => {
  chartData.value = setChartData()
  chartOptions.value = setChartOptions()
})

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement)

  const labels = [
    'Savings',
    'Fun',
    'Education',
    'Groceries',
    'Utilities',
    'Car Expenses',
    'Fast Food',
    'Gas',
    'Medical',
    'Subscriptions'
  ]
  const budget = [1000, 1000, 900, 800, 750, 450, 200, 200, 170, 50]
  const amount = [0, 507.76, 699.00, 612.43, 1165.69, 312.11, 216.51, 236.67, 119.80, 49.90]

  
  const expenses = [
    // { label: 'Mortgage',      limit: 3835   ,  amount: 3834.80  },
    { label: 'Savings', limit: 1000, amount: 0 },
    { label: 'Fun', limit: 1000, amount: 287.12 },
    { label: 'Education', limit: 1000, amount: 400 },
    { label: 'Groceries', limit: 800, amount: 510.31 },
    { label: 'Utilities', limit: 750, amount: 84.33 },
    { label: 'Car Expenses', limit: 750, amount: 312.11 },
    { label: 'Fast Food', limit: 200, amount: 216.51 },
    { label: 'Gas', limit: 200, amount: 180.51 },
    { label: 'Medical', limit: 170, amount: 0 },
    { label: 'Subscriptions', limit: 50, amount: 49.9 }
  ]

  // const labels = expenses.map(({ label }) => label);
  // const budget = expenses.map(({ limit }) => limit);
  // const amount = expenses.map(({ amount }) => amount);

  return {
    labels: labels,
    datasets: [
      {
        label: 'Budget',
        backgroundColor: '#13466a',
        data: budget
      },
      {
        label: 'Expenses',
        backgroundColor: documentStyle.getPropertyValue('--red-500'),
        data: amount
      }
    ]
  }
}

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement)
  const textColor = documentStyle.getPropertyValue('--text-color')
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border')

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        labels: {
          color: 'white'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white',
          font: {
            weight: 500
          }
        },
        grid: {
          // display: false,
          // drawBorder: false
        }
      },
      y: {
        ticks: {
          color: 'white'
        },
        grid: {
          // color: surfaceBorder,
          drawBorder: false
        }
      }
    }
  }
}
</script>

<template>
  <div class="chart-container">
    <Chart type="bar" :data="chartData" :options="chartOptions" class="chart" />
  </div>
</template>

<style scoped lang='scss'>
.chart-container {
}

.chart {
  height: 400px;
  background: $dash-c-card-bg;
  border-radius: 5px;
  padding: 10px;
}
</style>
