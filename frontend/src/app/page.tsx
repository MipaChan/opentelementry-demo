'use client';

import { useState, useEffect } from 'react';
import { Todo } from '@/types/todo';
import { api } from '@/lib/api';

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const todos = await api.getTodos();
    setTodos(todos);
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    await api.createTodo({ title: newTodoTitle, completed: false });
    setNewTodoTitle('');
    loadTodos();
  };

  const handleToggleTodo = async (todo: Todo) => {
    if (!todo._id) return;
    await api.updateTodo(todo._id, { completed: !todo.completed });
    loadTodos();
  };

  const handleDeleteTodo = async (_id: string) => {
    if (!_id) return;
    try {
      await api.deleteTodo(_id);
      loadTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <main className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Todo List</h1>
      
      <form onSubmit={handleAddTodo} className="mb-8 flex gap-2">
        <input
          type="text"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Add new todo..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className="flex items-center gap-2 p-4 bg-white rounded-lg shadow"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggleTodo(todo)}
              className="h-5 w-5 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.title}
            </span>
            <button
              onClick={() => todo._id && handleDeleteTodo(todo._id)}
              className="text-red-500 hover:text-red-700 focus:outline-none"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
