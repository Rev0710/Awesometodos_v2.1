export default function Todo(props) {
  // Toggle todo status
  const updateTodo = async (todoId, currentStatus) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PUT",
        body: JSON.stringify({ status: !currentStatus }), // toggle status
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (json.acknowledged) {
        // Update frontend immediately
        props.setTodos((currentTodos) =>
          currentTodos.map((todo) =>
            todo._id === todoId ? { ...todo, status: !todo.status } : todo
          )
        );
      }
    } catch (err) {
      console.error("Failed to update todo status:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (todoId) => {
    try {
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.acknowledged) {
        props.setTodos((currentTodos) =>
          currentTodos.filter((todo) => todo._id !== todoId)
        );
      }
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  return (
    <div className="todo">
      <p>{props.todo.todo}</p>
      <div className="mutations">
        {/* Status toggle button */}
        <button
          className="todo__status"
          onClick={() => updateTodo(props.todo._id, props.todo.status)}
        >
          {props.todo.status ? "☑" : "☐"}
        </button>

        {/* Delete button */}
        <button
          className="todo__delete"
          onClick={() => deleteTodo(props.todo._id)}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}