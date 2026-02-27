const BACKEND_URL = "https://awesometodos-v2-1.onrender.com";

export default function Todo({ todo, setTodos }) {
  // Toggle status immediately (optimistic UI)
  const updateTodo = async (todoId, currentStatus) => {
    setTodos((curr) =>
      curr.map((t) => (t._id === todoId ? { ...t, status: !t.status } : t))
    );

    try {
      await fetch(`${BACKEND_URL}/api/todos/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: !currentStatus }),
      });
    } catch (err) {
      console.error("Failed to update todo:", err);
      // revert if error
      setTodos((curr) =>
        curr.map((t) => (t._id === todoId ? { ...t, status: currentStatus } : t))
      );
    }
  };

  // Delete todo
  const deleteTodo = async (todoId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/todos/${todoId}`, { method: "DELETE" });
      const json = await res.json();
      if (json.acknowledged) setTodos((curr) => curr.filter((t) => t._id !== todoId));
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  return (
    <div className="todo">
      <p>{todo.todo}</p>
      <button onClick={() => updateTodo(todo._id, todo.status)}>
        {todo.status ? "☑" : "☐"}
      </button>
      <button onClick={() => deleteTodo(todo._id)}>🗑️</button>
    </div>
  );
}