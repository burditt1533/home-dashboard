<script setup>
import { TodoistApi } from '@doist/todoist-api-typescript'
import OrderList from 'primevue/orderlist'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import Avatar from 'primevue/avatar'
import ToDoConfetti from './ToDoConfetti.vue'
import philImage from '../../assets/images/phil.png'
import anitaImage from '../../assets/images/anita.png'
import deuceImage from '../../assets/images/deuce.png'
import deneeImage from '../../assets/images/denee.png'

import { ref, onMounted, computed } from 'vue'

// https://developer.todoist.com/rest/v2/?javascript#tasks
// https://app.todoist.com/app/project/daily-goals-2332473337

const api = new TodoistApi('a769a5f00601244ec6b51947cb6ca1c0ef853344')
const backendIp = 'http://192.168.0.111:5038'
const project = ref({})
const tasks = ref({
  active: [],
  completed: [],
  all: []
})
const visible = ref(false)
const newTaskName = ref(null)
const newTaskAssignee = ref(null)
const todoChecks = ref()
const completingTaskId = ref(null)
const reopeningTaskId = ref(null)
const confetti = ref(null)

onMounted(() => {
  project.value = {
    id: '2332473337'
  }
  fetchTasks()
  // getProjects();
})

const getProjects = () => {
  api
    .getProjects()
    .then((projects) => {
      project.value = projects.find((project) => project.name === 'Daily goals')
      fetchTasks()
    })
    .catch((error) => console.log(error))
}

const completeTask = (task) => {
  confetti.value.shootUnicorns()
  completingTaskId.value = task.id
  api
    .closeTask(task.id)
    .then((isSuccess) => {
      if (isSuccess) {
        fetchTasks()
      }
    })
    .catch((error) => console.log(error))
}

const reopenTask = (task) => {
  reopeningTaskId.value = task.id
  api
    .reopenTask(task.id)
    .then((isSuccess) => {
      if (isSuccess) {
        fetchTasks()
      }
    })
    .catch((error) => console.log(error))
}

const addTask = () => {
  api
    .addTask({
      content: newTaskName.value,
      // dueString: "tomorrow at 12:00",
      // dueLang: "en",
      // assignee_id: '42516736',
      assignee_id: newTaskAssignee.value,
      priority: 4,
      projectId: project.value.id
    })
    .then(() => {
      visible.value = false
      fetchTasks()
    })
    .catch((error) => console.log(error))
}

const fetchTasks = async () => {
  // let tempTasks = []

  // await api.getTasks({ project_id: project.value.id, filters: 'view all' })
  //   .then((response) => {
  //     tasks.value.active = response
  //     tempTasks = [...tasks.value.active]
  //   })
  //   .catch((error) => console.log(error))

  let response = null
  try{
    // response = await fetch(`${backendIp}/getAllTasks`)
    response = await fetch(`https://burdback.netlify.app/.netlify/functions/api`, {
      method: 'GET',
    })
  }catch(error) {
    // alert(error)
  }

  // tasks.value.completed = await response.json()
  // tasks.value.all = tempTasks.concat(tasks.value.completed)

  tasks.value.all = await response.json()
  completingTaskId.value = null
  reopeningTaskId.value = null
}

const tasker = computed(() => {
  // console.log(tasks.value.all.map(task => [task.responsible_uid, task.content]))
  return [
    {
      id: '42516736',
      name: 'Phil',
      active: tasks.value.active.filter((task) => task.assigneeId === '42516736'),
      completed: tasks.value.completed.filter((task) => task.user_id === '42516736'),
      all: tasks.value.all.filter((task) => task.responsible_uid === '42516736'),
      image: philImage
    },
    {
      id: '44593032',
      name: 'Anita',
      active: tasks.value.active.filter((task) => task.assigneeId === '44593032'),
      completed: tasks.value.completed.filter((task) => task.user_id === '44593032'),
      all: tasks.value.all.filter((task) => task.responsible_uid === '44593032'),
      image: anitaImage
    },
    {
      id: '49343570',
      name: 'Deuce',
      // tasks: tasks.value.filter(task => task.labels.includes('Deuce')),
      active: tasks.value.active.filter((task) => task.assigneeId === '49343570'),
      completed: tasks.value.completed.filter((task) => task.user_id === '49343570'),
      all: tasks.value.all.filter((task) => task.responsible_uid === '49343570'),
      image: deuceImage
    },
    {
      id: '49343535',
      name: 'Deneé',
      // tasks: tasks.value.filter(task => task.labels.includes('Denee')),
      active: tasks.value.active.filter((task) => task.assigneeId === '49343535'),
      completed: tasks.value.completed.filter((task) => task.user_id === '49343535'),
      all: tasks.value.all.filter((task) => task.responsible_uid === '49343535'),
      image: deneeImage
    }
    // {
    //   id: '1',
    //   name: 'Unassigned',
    //   tasks: tasks.value.filter(task => task.assigneeId === null),
    //   label: 'U'
    // }
  ]
})
</script>

<template>
  <div>
    <Dialog v-model:visible="visible" modal :style="{ width: '42rem' }" dismissableMask>
      <span class="p-text-secondary block mb-5">Add Task</span>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="username" class="font-semibold w-6rem">Task Name</label>
        <InputText id="username" class="flex-auto" autocomplete="off" v-model="newTaskName" />
      </div>
      <div class="flex flex-wrap gap-3">
        <div class="flex align-items-center">
          <RadioButton v-model="newTaskAssignee" inputId="assignee1" name="phil" value="42516736" />
          <label for="assignee1" class="ml-2">Phil</label>
        </div>
        <div class="flex align-items-center">
          <RadioButton
            v-model="newTaskAssignee"
            inputId="assignee2"
            name="anita"
            value="44593032"
          />
          <label for="assignee2" class="ml-2">Anita</label>
        </div>
      </div>
      <div class="flex justify-content-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
        <Button type="button" label="Save" @click="addTask"></Button>
      </div>
    </Dialog>

    <div class="task-list-container">
      <div v-for="assignee in tasker" :key="assignee" class="task-container">
        <h4 class="task-header">
          <Avatar
            :label="assignee.label"
            :image="assignee.image"
            class="mr-2"
            style="color: $dash-c-blue"
            size="large"
            shape="circle"
          />
          <div class="assignee-name">{{ assignee.name }}</div>
        </h4>

        <div class="task-list">
          <div
            v-for="task in assignee.all"
            :class="[
              'task',
              {
                completed:
                  (task.completed_at && reopeningTaskId !== task.id) ||
                  completingTaskId === task.id,
                pending: reopeningTaskId === task.id || completingTaskId === task.id
              }
            ]"
            :key="task.id"
            @click="!!task.completed_at ? reopenTask(task) : completeTask(task)"
          >
            <div class="task-name">{{ task.content }}</div>
          </div>
        </div>
        <!-- <div class="add-task" @click='visible = true'><i class="ri-add-line"></i></div> -->
      </div>
    </div>

    <ToDoConfetti ref='confetti' />
  </div>
</template>

<style scoped lang="scss">
.task-list-container {
  display: flex;
  justify-content: space-between;
  gap: $dash-c-home-gap;

  .task-container {
    padding: 10px;
    width: 33%;
    min-height: 500px;
    background: $dash-c-card-bg;
    color: $dash-c-white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .task-header {
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      padding: 0 15px;

      .assignee-name {
        font-size: 18px;
        margin-left: 10px;
        font-weight: bold;
      }
    }
    .task-list {
      height: 100%;

      .task {
        padding: 20px 15px;
        background: $dash-c-purple;
        // border-radius: 4px;
        margin-bottom: 10px;
        cursor: pointer;

        .task-name {
          font-size: 15px;
          display: inline;
        }

        .task-button {
          width: 100%;
          color: $dash-c-white;
          border: 1px solid $dash-c-blue;
        }

        &.completed {
          opacity: 0.3;
        }

        &.pending:after {
          overflow: hidden;
          display: inline-block;
          vertical-align: bottom;
          animation: ellipsis steps(4, end) 1100ms infinite;
          content: '\2026'; /* ascii code for the ellipsis character */
          width: 0px;
        }

        @keyframes ellipsis {
          to {
            width: 1.25em;
          }
        }
      }
    }

    .add-task {
      background: lighten($dash-c-blue, 5%);
      height: 50px;
      width: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      border-radius: 50%;
      align-self: flex-end;
      padding: 9px;
      margin-top: 30px;
      cursor: pointer;
    }
  }

  @media(max-width: 500px) {
    flex-direction: column;

    .task-container {
      width: 100%;
    }
  }
}
</style>
