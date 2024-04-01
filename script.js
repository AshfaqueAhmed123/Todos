//DOM Elements
const form = document.getElementById("form");
const tasksContainer = document.getElementById("tasks-container");
const input = document.querySelector("form input");
const submitBtn = document.querySelector("form button");
const searchBtn = document.getElementById("search-icon");

// Functions

// create new task component
function taskComponent(task) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task");
  taskItem.innerHTML = `
   <div class="status-section">
   <input type="checkbox" id='chechbox'>
  </div>
  <div class="content-section">
   <p contenteditable="true" id='task-text'>${task.content}</p>
  </div>
  <div class="editing-section">
   <span id='removeTask' class='hoverable'>❌</span>
  </div>
   `;
  taskItem.id = task.id;
  tasksContainer.appendChild(taskItem);
}

function taskMarkedAsDone(task) {
  const taskItem = document.createElement("div");
  taskItem.classList.add("task");
  taskItem.classList.add("copletedTask");
  taskItem.innerHTML = `
   <div class="status-section">
   <input type="checkbox" id='chechbox'>
  </div>
  <div class="content-section">
   <p id='task-text'>${task.content}</p>
  </div>
  <div class="editing-section">
   <span id='removeTask' class='hoverable'>❌</span>
  </div>
   `;
  taskItem.id = task.id;
  tasksContainer.appendChild(taskItem);
}

function render(tasks) {
  tasks.forEach((task) => {
    if (task.isCompleted) {
      taskMarkedAsDone(task);
      updateCount();
      return;
    }
    taskComponent(task);
    updateCount();
  });
}

function updateCount() {
  let totoal = document.getElementById("total");
  let remaining = document.getElementById("remaining");
  let completed = document.getElementById("completed");

  let totalTasks = JSON.parse(localStorage.getItem("tasks"));

  let completedTasks = [];
  totalTasks.forEach((task) => {
    if (task.isCompleted == true) {
      completedTasks.push(task);
    }
  });

  totoal.innerText = totalTasks.length;
  remaining.innerText = totalTasks.length - completedTasks.length;
  completed.innerText = completedTasks.length;
}

// search tasks
function searchTasks(content) {
  let tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.style.backgroundColor = "";
  });
  tasks.forEach((task) => {
    if (
      task.children[1].firstElementChild.innerText.includes(content) == true
    ) {
      task.style.backgroundColor = "yellow";
      window.scrollTo(task);
    }
  });
}

// events

window.addEventListener("DOMContentLoaded", (e) => {
  // when first time window will load check that if tasks are present in the localStorage if not create them
  let tasks = [];
  if (localStorage.getItem("tasks") == null) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasks = JSON.parse(localStorage.getItem("tasks"));
  } else {
    tasks = JSON.parse(localStorage.getItem("tasks"));
  }

  // load tasks from storage if present
  if (JSON.parse(localStorage.getItem("tasks") != null || "")) {
    render(JSON.parse(localStorage.getItem("tasks")));
  }

  // update tasks count
  updateCount();

  // when form is submmitted  create and add a new task item
  form.addEventListener("submit", (e) => {
    if (input.value == "") {
      e.preventDefault();
      return;
    }
    e.preventDefault();

    // create new task object
    let task = {
      id: new Date().getTime(),
      content: input.value,
      isCompleted: false,
    };

    // add task in the tasks array
    input.value = "";
    tasks.push(task);

    // save tasks array in the localstorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // render the tasks
    tasks = localStorage.getItem("tasks");
    tasks = JSON.parse(tasks);
    tasksContainer.innerHTML = "";
    render(tasks);
  });

  // search tasks
  searchBtn.addEventListener("click", (e) => {
    let input = prompt("enter a little bit of content of task");
    searchTasks(input);
  });

  window.addEventListener("click", (e) => {
    if (e.target.id == "removeTask") {
      // delete task
      let taskID = e.target.parentElement.parentElement.id;

      // get the taskID id and remove that task from the tasks array
      let newTasks = [];
      JSON.parse(localStorage.getItem("tasks")).forEach((task) => {
        if (task.id == taskID) {
          return;
        }
        newTasks.push(task);
      });
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      tasksContainer.innerHTML = "";
      render(JSON.parse(localStorage.getItem("tasks")));
      updateCount();
    }
  });

  // listen for task mark checked event and mark task as done
  window.addEventListener("change", (e) => {
    if (
      e.target.id == "chechbox" &&
      e.target.hasAttribute("type", "checkbox")
    ) {
      let task = e.target.parentElement.parentElement;
      let taskID = task.id;

      let newTasks = [];
      JSON.parse(localStorage.getItem("tasks")).forEach((task) => {
        if (task.id == taskID) {
          task.isCompleted = true;
          newTasks.push(task);
        } else {
          newTasks.push(task);
        }
      });
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      tasksContainer.innerHTML = "";
      render(JSON.parse(localStorage.getItem("tasks")));
    }
  });

  // edit tasks
  window.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      if (e.target.id == "task-text") {
        e.preventDefault();

        let taskID = e.target.parentElement.parentElement.id;

        let newTasks = [];
        JSON.parse(localStorage.getItem("tasks")).forEach((task) => {
          if (task.id == taskID) {
            task.content = e.target.innerHTML;
            newTasks.push(task);
          } else {
            newTasks.push(task);
          }
        });
        localStorage.setItem("tasks", JSON.stringify(newTasks));
        tasksContainer.innerHTML = "";
        render(JSON.parse(localStorage.getItem("tasks")));
      }
    }
  });
});

// written by : Ashfaque Ahmed
