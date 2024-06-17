<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router';
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Rating from 'primevue/rating';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { cleanHouse } from '@/stores/cleanHouse'

const cleanHouseStore = cleanHouse()
const expandedRows = ref({});
const taskEditing = ref({});
const route = useRoute();

const props = defineProps({
  roomId: {
    type: String,
    required: false
  }
})

const tableData = computed(() => {
  let data = []
  if (!!props.roomId) {
    data = cleanHouseStore.roomsWithTasks.filter((({ id }) => id === parseInt(props.roomId))) || []
  } else {
    data = cleanHouseStore.roomsWithTasks
  }

  return data
})

const updateTaskData = async () => {
  let response = await fetch(`http://127.0.0.1:3000/tasks/${ taskEditing.value.id }.json`, { 
    method: 'PUT', 
    headers: { 
      'Content-type': 'application/json'
    }, 
    body: JSON.stringify({
      date_completed: taskEditing.value.is_complete ? new Date().toISOString() : null,
      is_complete: taskEditing.value.is_complete,
      level: taskEditing.value.level,
      name: taskEditing.value.name
    }) 
  }); 
  response = await response.json()
  console.log(response)

  taskEditing.value = null
  cleanHouseStore.updateLocalTask(response)
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
  if(!!props.roomId) expandedRows.value[props.roomId] = true

  let response = await fetch('http://127.0.0.1:3000/rooms')
  response = await response.json()
  cleanHouseStore.addRoomsAndTasks(response)
})
</script>

<template>
  <div class='clean-house-data-container'>
    <DataTable v-model:expandedRows="expandedRows" :value="tableData" dataKey="id">
        <Column expander style="width: 5rem" />
        <Column field="id" header="Id"></Column>
        <Column field='name' header="Name"></Column>
        <Column field="image_url" header="Image">
            <!-- <template #body="slotProps">
              <img :src="`https://primefaces.org/cdn/primevue/images/product/${slotProps.data.image}`" :alt="slotProps.data.image" class="shadow-lg" width="64" />
            </template> -->
        </Column>
        <Column header="Goal Level">
          <template #body='slotProps'>
            <Rating
              v-model='slotProps.data.goal_level'
              :cancel="false"
            />
          </template>
        </Column>
        <template #expansion="slotProps">
          <h5>Tasks for {{ slotProps.data.name }}</h5>
          <DataTable :value="slotProps.data.tasks">
            <Column field="id" header="Id"></Column>
            <Column header="Name">
              <template #body="slotProps">
                <div v-if='slotProps.data.id !== taskEditing?.id'>{{ slotProps.data.name }}</div>
                <InputText v-else v-model='taskEditing.name' id="taskName" class="flex-auto" autocomplete="off" />
              </template>
            </Column>
            <Column field="level" header="Level">
              <template #body='slotProps'>
                <Rating
                  v-model='slotProps.data.level'
                  :readonly='slotProps.data.id !== taskEditing?.id'
                  :cancel="false"
                />
              </template>
            </Column>
            <Column header="isComplete">
              <template #body="slotProps">
                <Checkbox
                  v-model="slotProps.data.is_complete"
                  :readonly='slotProps.data.id !== taskEditing?.id'
                  id='isComplete'
                  :binary="true"
                />
              </template>
            </Column>
            <Column header="Date Completed">
                <template #body="slotProps">
                  {{ timeSince(slotProps.data.date_completed) }}
                  {{ !!timeSince(slotProps.data.date_completed) ? 'ago' : '' }}
                </template>
            </Column>
            <Column headerStyle="width:4rem">
                <template #body='slotProps'>
                    <div v-if='slotProps.data.id === taskEditing?.id' class='edit-save'>
                      <Button @click='taskEditing = null' icon="ri-close-large-fill" />
                      <Button @click='updateTaskData()' icon="ri-save-line" />
                    </div>
                    <Button v-else @click='taskEditing = slotProps.data' icon="ri-pencil-fill" />
                </template>
            </Column>
          </DataTable>
        </template>
    </DataTable>
  </div>
</template>

<style lang="scss">

.edit-save {
  display: flex;
}

</style>
