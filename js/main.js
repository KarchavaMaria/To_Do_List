let taskNameInput = document.querySelector("#task-name-input");
let addTaskBtn = document.querySelector("#add-task-btn");
let startMessage = document.querySelector("#start-message");
let taskList = document.querySelector(".task-list");
let filterOption = document.querySelector(".filter-todo button");
let filterSelect = document.querySelector("#filter-select");
let divDate = document.querySelector(".date");
let deleteAllTaskBtn = document.querySelector("#delete-all-tasks");
let completedCountEl = document.querySelector(".completed-count");
let uncompletedCountEl = document.querySelector(".uncompleted-count");
let errorEl = document.querySelector("#error-message");
let whiteTheme = document.querySelector(".white-theme-btn");
let colorTheme = document.querySelector(".color-theme-btn");
let blackTheme = document.querySelector(".black-theme-btn");

filterOption.addEventListener("click", filterTodo);

addTaskBtn.addEventListener("click", addTaskHandler);
taskList.addEventListener("click", changeTaskState);
deleteAllTaskBtn.addEventListener("click", deleteAllTaskHandler);
whiteTheme.addEventListener("click", () => themeHandler("white"));
colorTheme.addEventListener("click", () => themeHandler("color"));
blackTheme.addEventListener("click", () => themeHandler("black"));

taskNameInput.addEventListener("keydown", function (e) {
    if (e.code === "Enter") addTaskHandler();
})

filterSelect.addEventListener("change", (e) => {
    if (e.target.value === "deleteAll") {
        deleteAllTaskHandler();
        e.target.value = "all";
    } else {
        filterTodo(e);
    }
});

function loadTasks() {
    let tasks = localStorage.getItem("tasks");
    return tasks ? JSON.parse(tasks) : [];
}

function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function themeDefault() {
    let theme = localStorage.getItem("theme");
    if (theme) {
        document.body.className = theme + "-theme";
    }
}

function themeHandler(theme) {
    document.body.className = theme + "-theme";
    localStorage.setItem("theme", theme);
}

function createTask(taskObj, index) {
    let div = document.createElement("div");
    div.classList.add("task");
    if (taskObj.completed) div.classList.add("completed");

    let input = document.createElement("input");
    input.type = "checkbox";
    input.checked = taskObj.completed;

    let p = document.createElement("p");
    p.innerText = taskObj.text;

    let dateTask = document.createElement("div");
    dateTask.textContent = taskObj.date;
    dateTask.setAttribute("id", "dateTask");

    let divBtn = document.createElement("div");

    let editorTask = document.createElement("button");
    editorTask.textContent = "🖋️";

    editorTask.addEventListener("click", () => {
        p.contentEditable = true;
        p.focus();
    });

    p.addEventListener("blur", () => {
        p.contentEditable = false;
        let tasks = loadTasks();
        tasks[index].text = p.textContent.trim();
        saveTasks(tasks);
    })

    p.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            p.blur();
        }
    })

    let btnDeleteTask = document.createElement("button");
    btnDeleteTask.textContent = "🗑";
    btnDeleteTask.addEventListener("click", () => {
            let value = confirm("Ви впевнені, що хочете видалити завдання?");
            {
                if (value) {
                    alert("Завдання видаленно");
                    let tasks = loadTasks();
                    div.remove();
                    tasks.splice(index, 1);
                    saveTasks(tasks);
                    renderTasks();

                } else {
                    showError("Завдання не видаленно");
                }
            }
        }
    )

    div.append(input);
    div.append(p);
    div.append(dateTask);
    div.appendChild(divBtn);
    divBtn.appendChild(editorTask);
    divBtn.appendChild(btnDeleteTask);

    return div;
}

function updateCount() {
    let allCount = document.querySelector('.all-count');
    
    let tasks = loadTasks();
    let count = tasks.length;

    let completedCount = tasks.filter(task => task.completed).length;
    let uncompletedCount = tasks.filter(task => !task.completed).length;

    allCount.textContent = `Всього завдань: ${[count]}`;
    completedCountEl.textContent = `Виконаних завдань: ${[completedCount]}`
    uncompletedCountEl.textContent = `Невиконаних завдань: ${uncompletedCount}`
}

function dataTasks() {
    let date = new Date();
    divDate.textContent = date.toLocaleString();
}

function changeTaskState(e) {
    if (e.target.nodeName !== "input" && e.target.type !== "checkbox") {
        return;
    }

    let tasks = loadTasks();
    let index = Array.from(taskList.children).indexOf(e.target.parentElement);
    tasks[index].completed = e.target.checked;

    tasks.sort((a, b) => a.completed - b.completed);

    saveTasks(tasks);
    renderTasks();
    updateCount();

}

function addTaskHandler() {
    let text = taskNameInput.value.trim();
    if (text) {
        if (!startMessage.hidden) startMessage.hidden = true;

        let tasks = loadTasks();
        let newTaskObj = {
            text,
            completed: false,
            date: new Date().toLocaleString(),
        };

        tasks.push(newTaskObj);
        saveTasks(tasks);
        renderTasks();
        taskNameInput.value = "";
        updateCount();
    } else {
        showError("Введіть завдання");
    }
}

function deleteAllTaskHandler() {
    let question = confirm("Ви впевнені що хочете видалити всі завдання");
    if (question) {
        localStorage.removeItem("tasks");
        taskList.innerHTML = "";
        updateCount();
    }
}

function filterTodo(e) {
    let todos = Array.from(document.querySelectorAll(".task-list .task"));
    todos.forEach(function (task) {
        switch (e.target.value) {
            case "all":
                task.style.display = "";
                break;
            case "completed":
                if (task.classList.contains("completed")) {
                    task.style.display = "";
                } else {
                    task.style.display = "none";
                }
                break;
            case "uncompleted":
                if (task.classList.contains("completed")) {
                    task.style.display = "none";
                } else {
                    task.style.display = "";
                }
                break;
        }
    });
}

function renderTasks() {
    taskList.innerHTML = "";
    let tasks = loadTasks();
    tasks.forEach((task, index) => {
        taskList.append(createTask(task, index));
    });
    updateCount();
}

function showError(message) {
    errorEl.textContent = message;
    setTimeout(() => {
        errorEl.textContent = "";
    }, 3000)
}

setTimeout(dataTasks, 0)
setInterval(dataTasks, 1000);
renderTasks(loadTasks());
themeDefault();



