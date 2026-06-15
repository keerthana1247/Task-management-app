function addTask() {
    const taskInput = document.getElementById("taskInput");

    if (taskInput.value.trim() === "") {
        alert("Enter task");
        return;
    }

    fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            task: taskInput.value
        })
    })
        .then(() => {
            taskInput.value = "";
            loadTasks();
        });
}

function loadTasks() {
    fetch("http://localhost:3000/tasks")
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("taskList");
            list.innerHTML = "";

            data.forEach(task => {
                const li = document.createElement("li");

                li.innerHTML = `
                <span style="text-decoration: ${task.completed ? 'line-through' : 'none'}">
                    ${task.text}
                </span>

                <div>
                    <button onclick="toggleComplete('${task._id}', ${task.completed})">✔</button>
                    <button onclick="editTask('${task._id}')">✏️</button>
                    <button onclick="deleteTask('${task._id}')">🗑️</button>
                </div>
            `;

                list.appendChild(li);
            });
        });
}

function deleteTask(id) {
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: "DELETE"
    })
        .then(() => loadTasks());
}

function toggleComplete(id, current) {
    fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            completed: !current
        })
    })
        .then(() => loadTasks());
}

function editTask(id) {
    const newText = prompt("Enter new task:");

    if (!newText) return;

    fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text: newText
        })
    })
        .then(() => loadTasks());
}

loadTasks();