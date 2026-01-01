/* ===============================
   GLOBAL STATE
================================ */

let tasksData = {};
let dragElement = null;

/* ===============================
   DOM REFERENCES
================================ */

const todo = document.getElementById('to-do');
const progress = document.getElementById('progress');
const done = document.getElementById('done');

const modal = document.querySelector('.modal');
const modalBg = document.querySelector('.modal .bg');
const toggleModalBtn = document.getElementById('toggle-modal');
const clearAllBtn = document.getElementById('clear-all');
const addTaskBtn = document.getElementById('add-task-btn');

const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');

/* ===============================
   LOAD TASKS FROM LOCAL STORAGE
================================ */

const storedData = JSON.parse(localStorage.getItem('tasksData')) || {};

[todo, progress, done].forEach(col => {
    const colTasks = storedData[col.id] || [];
    colTasks.forEach(task => {
        createTask(task.title, task.desc, col);
    });
});

updateCounts();

/* ===============================
   DRAG & DROP
================================ */

function addDragEventsOnColumn(column) {
    column.addEventListener('dragover', e => e.preventDefault());

    column.addEventListener('dragenter', e => {
        e.preventDefault();
        column.classList.add('hover-over');
    });

    column.addEventListener('dragleave', () => {
        column.classList.remove('hover-over');
    });

    column.addEventListener('drop', e => {
        e.preventDefault();
        column.classList.remove('hover-over');

        if (!dragElement) return;

        column.appendChild(dragElement);
        dragElement = null;

        updateCounts();
        saveTasks();
    });
}

[todo, progress, done].forEach(addDragEventsOnColumn);

/* ===============================
   CREATE TASK
================================ */

function createTask(title, desc, column) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    taskDiv.draggable = true;

    taskDiv.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button class="delete-btn">Delete</button>
    `;

    taskDiv.addEventListener('dragstart', () => {
        dragElement = taskDiv;
    });

    column.appendChild(taskDiv);
}

/* ===============================
   ADD TASK
================================ */

addTaskBtn.addEventListener('click', () => {
    const title = taskTitleInput.value.trim();
    const desc = taskDescInput.value.trim();

    if (!title || !desc) return;

    createTask(title, desc, todo);

    taskTitleInput.value = '';
    taskDescInput.value = '';

    modal.classList.remove('active');

    updateCounts();
    saveTasks();
});

/* ===============================
   DELETE TASK (WITH ANIMATION)
================================ */

document.addEventListener('click', e => {
    if (!e.target.classList.contains('delete-btn')) return;

    const task = e.target.closest('.task');
    if (!task) return;

    task.classList.add('removing');

    setTimeout(() => {
        task.remove();
        updateCounts();
        saveTasks();
    }, 200);
});

/* ===============================
   CLEAR ALL TASKS
================================ */

clearAllBtn.addEventListener('click', () => {
    const confirmClear = confirm('Are you sure you want to delete all tasks?');
    if (!confirmClear) return;

    [todo, progress, done].forEach(col => {
        col.querySelectorAll('.task').forEach(task => task.remove());
    });

    localStorage.removeItem('tasksData');
    updateCounts();
});

/* ===============================
   MODAL TOGGLE
================================ */

toggleModalBtn.addEventListener('click', () => {
    modal.classList.toggle('active');
});

modalBg.addEventListener('click', () => {
    modal.classList.remove('active');
});

/* ===============================
   HELPERS
================================ */

function updateCounts() {
    [todo, progress, done].forEach(col => {
        const countEl = col.querySelector('.heading .right');
        countEl.textContent = `Count: ${col.querySelectorAll('.task').length}`;
    });
}

function saveTasks() {
    tasksData = {};

    [todo, progress, done].forEach(col => {
        tasksData[col.id] = Array.from(col.querySelectorAll('.task')).map(task => ({
            title: task.querySelector('h2').textContent,
            desc: task.querySelector('p').textContent
        }));
    });

    localStorage.setItem('tasksData', JSON.stringify(tasksData));
}
