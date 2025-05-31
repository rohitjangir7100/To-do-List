import React, { useState, useEffect } from "react";
import "./TodoList.css";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    //Load once on initial render
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });

  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");

  //Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { text: newTask.trim(), completed: false, status: "enter" }]);
    setNewTask("");
  };

  const toggleTask = (index) => {
    const updated = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);
  };

  const removeTask = (index) => {
    const updated = [...tasks];
    updated[index]={...updated[index], status:"exit"}
    setTasks(updated);

    setTimeout(()=>{
      const finalTasks = updated.filter((_, i) => i !== index)
      setTasks(finalTasks)
    },400)
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const remainingTasks = tasks.filter(task => !task.completed).length

  return (
    <div className="todo-container">
      <h1 className="todo-title">📝 To-Do List</h1>

      <div className="todo-input-container">
        <input
          type="text"
          className="todo-input"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask} className="todo-button">Add</button>
      </div>

      <div className="todo-filters">
        {["all", "active", "completed"].map((type) => (
          <button
            key={type}
            className={`filter-button ${filter === type ? "active" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <p className="task-counter fade-in" key={remainingTasks + "- " + tasks.length}>
        {tasks.length === 0 ? (
          <>
            ✨No tasks yet !  Add some tasks to get started💪
          </>
        ) :
          remainingTasks === 0 ? (
            <>
              🎉 All tasks completed! Great job!🏆
            </>
          ) : (
            <>
              📝 You have {remainingTasks} task{remainingTasks !== 1 ? "s" : ""} to go!
            </>
          )}
      </p>

      <ul className="todo-list">
        {filteredTasks.map((task, index) => (
          <li key={index} className={`todo-item ${task.completed ? "completed" : ""} ${task.status === "enter" ? "enter" : ""} ${task.status === "exit" ? "exit" : ""}`}>
            <div>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(index)}
              />
              <span className={task.completed ? "completed" : ""}>{task.text}</span>
            </div>
            <button className="remove-button" onClick={() => removeTask(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
