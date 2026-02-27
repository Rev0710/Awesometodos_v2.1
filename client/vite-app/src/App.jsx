import { useEffect, useState } from "react";
import Todo from "./Todo";
import "./App.css";

// ✅ Backend URL (deployed)
const BACKEND_URL = "https://awesometodos-v2-1.onrender.com";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  // Fetch todos on mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/todos`);
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };
    fetchTodos();
  }, []);

  // Create new todo
  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.trim().length <= 3) {
      return alert("Todo must be longer than 3 characters");
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ todo: content }),
      });

      const newTodo = await res.json();
      setTodos((prev) => [...prev, newTodo]);
      setContent("");
    } catch (err) {
      console.error("Failed to create todo:", err);
    }
  };

  return (
    <main className="container">
      <h1 className="title">Awesome Todos</h1>

      <form className="form" onSubmit={createNewTodo}>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a new todo..."
          className="form__input"
          required
        />
        <button type="submit">Create Todo</button>
      </form>

      <div className="todos">
        {todos.length > 0 ? (
          todos.map((todo) => <Todo todo={todo} setTodos={setTodos} key={todo._id} />)
        ) : (
          <p>No todos found.</p>
        )}
      </div>
    </main>
  );
}