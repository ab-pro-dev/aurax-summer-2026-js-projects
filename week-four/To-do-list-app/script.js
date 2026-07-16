const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const li = document.createElement('li');
    li.classList.add('task-item');
    li.innerHTML = `
        <span>${text}</span>
        <button class="delete-btn" aria-label="Delete task">&times;</button>
    `;
    taskList.appendChild(li);

    taskInput.value = '';
    taskInput.focus();
}

taskList.addEventListener('click', function (e) {
    if (e.target.classList.contains('delete-btn')) {
        e.target.closest('.task-item').remove();
    }
});

addTaskBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});
