document.addEventListener("DOMContentLoaded", function () {
    const taskForm = document.getElementById("task-form");
    const taskList = document.getElementById("task-list");
    const clearCompletedBtn = document.getElementById("clear-completed");

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = "";
        tasks.forEach((task, index) => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");

            if (task.completed) {
                taskItem.classList.add("completed");
            }

            taskItem.innerHTML = `
                <span>${task.title}</span>
                <input type="checkbox" data-index="${index}" ${task.completed ? "checked" : ""}>
                <button class="delete" data-index="${index}">Delete</button>
            `;

            taskList.appendChild(taskItem);
        });
    }

    taskForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const taskInput = document.getElementById("task-title");
        const taskTitle = taskInput.value.trim();

        if (taskTitle !== "") {
            tasks.push({ title: taskTitle, completed: false });
            saveTasks();
            renderTasks();
            taskInput.value = "";
        }
    });

    taskList.addEventListener("change", function (e) {
        if (e.target.matches("input[type='checkbox']")) {
            const index = e.target.dataset.index;
            tasks[index].completed = e.target.checked;
            saveTasks();
            renderTasks();
        }
    });

    taskList.addEventListener("click", function (e) {
        if (e.target.matches("button.delete")) {
            const index = e.target.dataset.index;
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    });

    clearCompletedBtn.addEventListener("click", function () {
        tasks.forEach((task, index) => {
            if (task.completed) {
                tasks.splice(index, 1);
            }
        });
        saveTasks();
        renderTasks();
    });

    const menuIcon = document.getElementById("menu-icon");
    const closeSidebarBtn = document.getElementById("close-sidebar");
    const sidebar = document.getElementById("sidebar");
    const recycleBinLink = document.getElementById("recycle-bin");
    const importantTasksLink = document.getElementById("important-tasks");
    const completedTasksLink = document.getElementById("completed-tasks");

    let sidebarOpen = false;

    function openSidebar() {
        sidebarOpen = true;
        sidebar.style.left = "0";
    }

    function closeSidebar() {
        sidebarOpen = false;
        sidebar.style.left = "-300px";
    }

    menuIcon.addEventListener("click", openSidebar);

    closeSidebarBtn.addEventListener("click", closeSidebar);

    recycleBinLink.addEventListener("click", function () {
        displayDeletedTasks();
    });

    importantTasksLink.addEventListener("click", function () {
       displayImportantTasks();
    });

    completedTasksLink.addEventListener("click", function () {
        displayCompletedTasks();
    });
});
