import { useEffect, useState } from "react";
import Todo from "./Todo";
import "./App.css";

// ✅ Full backend URL
const API_URL = "https://awesometodos-v2-1.onrender.com/api/todos"; // <-- use your deployed backend URL

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  // Fetch todos on load
  useEffect(() => {
    const getTodos = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error("Failed to fetch todos:", err);
      }
    };
    getTodos();
  }, []);

  // Create new todo
  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          body: JSON.stringify({ todo: content }),
          headers: { "Content-Type": "application/json" },
        });
        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
        setContent("");
      } catch (err) {
        console.error("Failed to create todo:", err);
      }
    } else {
      alert("Todo must be longer than 3 characters");
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
          todos.map((todo) => (
            <Todo todo={todo} setTodos={setTodos} key={todo._id} />
          ))
        ) : (
          <p>No todos found.</p>
        )}
      </div>
    </main>
  );
}