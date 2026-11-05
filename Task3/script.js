
"use strict";

// Select HTML elements
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");

const totalCount = document.getElementById("total-count");
const remainingCount = document.getElementById("remaining-count");
const completedCount = document.getElementById("completed-count");

const clearCompletedButton =
    document.getElementById("clear-completed");

const taskCountMessage =
    document.getElementById("task-count-message");

const formMessage = document.getElementById("form-message");
const currentDate = document.getElementById("current-date");
const filterButtons = document.querySelectorAll(".filter-button");

// Application state
const STORAGE_KEY = "auspify-todo-tasks";

let tasks = loadTasks();
let currentFilter = "all";

// Show today's date
currentDate.textContent = new Date().toLocaleDateString(
    "en-US",
    {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    }
);

// Load saved tasks safely
function loadTasks() {
    try {
        const savedTasks = localStorage.getItem(STORAGE_KEY);

        if (!savedTasks) {
            return [];
        }

        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks)) {
            return [];
        }

        // Accept only tasks with valid basic fields
        return parsedTasks.filter(function (task) {
            return (
                task !== null &&
                typeof task === "object" &&
                typeof task.id === "string" &&
                typeof task.text === "string" &&
                task.text.trim().length > 0 &&
                task.text.length <= 200 &&
                typeof task.completed === "boolean" &&
                typeof task.createdAt === "string"
            );
        });
    } catch (error) {
        console.error("Could not load saved tasks:", error);
        return [];
    }
}

// Save tasks in the browser
function saveTasks() {
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(tasks)
        );

        return true;
    } catch (error) {
        console.error("Could not save tasks:", error);

        showMessage(
            "Could not save changes. Check your browser storage."
        );

        return false;
    }
}

// Display feedback below the input
function showMessage(message) {
    formMessage.textContent = message;
}

// Add a new task
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const text = taskInput.value.trim();

    if (text.length === 0) {
        showMessage("Please enter a task.");
        taskInput.focus();
        return;
    }

    if (text.length > 200) {
        showMessage("Your task must be 200 characters or fewer.");
        return;
    }

    const newTask = {
        id: createTaskId(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);

    if (!saveTasks()) {
        tasks.shift();
        return;
    }

    // Show the newly added task
    currentFilter = "all";
    updateFilterButtons();
    renderTasks();

    taskForm.reset();
    showMessage("Task added successfully!");
    taskInput.focus();
});

// Create a unique identifier for each task
function createTaskId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return (
        Date.now().toString(36) +
        Math.random().toString(36).slice(2)
    );
}

// Render tasks on the page
function renderTasks() {
    taskList.replaceChildren();

    const visibleTasks = tasks.filter(function (task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    visibleTasks.forEach(function (task) {
        const listItem = document.createElement("li");
        listItem.className = "task-item";

        if (task.completed) {
            listItem.classList.add("completed");
        }

        // Checkbox for completing a task
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute(
            "aria-label",
            "Mark " + task.text + " as completed"
        );

        checkbox.addEventListener("change", function () {
            toggleTask(task.id);
        });

        // Task text and creation date
        const content = document.createElement("div");
        content.className = "task-content";

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const taskDate = document.createElement("span");
        taskDate.className = "task-date";

        const parsedDate = new Date(task.createdAt);

        taskDate.textContent = Number.isNaN(parsedDate.getTime())
            ? "Added previously"
            : "Added " + parsedDate.toLocaleDateString();

        content.append(taskText, taskDate);

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute(
            "aria-label",
            "Delete task: " + task.text
        );

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        listItem.append(checkbox, content, deleteButton);
        taskList.appendChild(listItem);
    });

    // Update the empty-state message
    emptyState.hidden = visibleTasks.length > 0;

    if (tasks.length === 0) {
        emptyState.querySelector("h3").textContent = "No tasks yet";
        emptyState.querySelector("p").textContent =
            "Add your first task and start making progress.";
    } else if (visibleTasks.length === 0) {
        emptyState.querySelector("h3").textContent =
            "No matching tasks";
        emptyState.querySelector("p").textContent =
            "Try another filter to see your tasks.";
    }

    // Update summary numbers
    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const remaining = tasks.length - completed;

    totalCount.textContent = tasks.length;
    remainingCount.textContent = remaining;
    completedCount.textContent = completed;

    taskCountMessage.textContent =
        remaining === 1
            ? "You have 1 task remaining."
            : "You have " + remaining + " tasks remaining.";
}

// Mark a task complete or incomplete
function toggleTask(taskId) {
    const task = tasks.find(function (item) {
        return item.id === taskId;
    });

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    if (!saveTasks()) {
        task.completed = !task.completed;
        renderTasks();
        return;
    }

    renderTasks();
}

// Delete a task
function deleteTask(taskId) {
    const originalTasks = tasks;

    tasks = tasks.filter(function (task) {
        return task.id !== taskId;
    });

    if (!saveTasks()) {
        tasks = originalTasks;
        return;
    }

    renderTasks();
    showMessage("Task deleted.");
}

// Filter tasks
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        updateFilterButtons();
        renderTasks();
    });
});

// Keep filter styling and accessibility state in sync
function updateFilterButtons() {
    filterButtons.forEach(function (button) {
        const isActive = button.dataset.filter === currentFilter;

        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

// Delete every completed task
clearCompletedButton.addEventListener("click", function () {
    const originalTasks = tasks;

    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    if (tasks.length === originalTasks.length) {
        showMessage("There are no completed tasks to clear.");
        return;
    }

    if (!saveTasks()) {
        tasks = originalTasks;
        return;
    }

    renderTasks();
    showMessage("Completed tasks cleared.");
});

// Initial page setup
updateFilterButtons();
renderTasks();
