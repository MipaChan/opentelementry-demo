import { Todo } from '../types/todo';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = {
  async getTodos(): Promise<Todo[]> {
    const res = await fetch(`${API_URL}/todos`);
    return res.json();
  },

  async createTodo(todo: Partial<Todo>): Promise<Todo> {
    const res = await fetch(`${API_URL}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    return res.json();
  },

  async updateTodo(_id: string, todo: Partial<Todo>): Promise<Todo> {
    const res = await fetch(`${API_URL}/todos/${_id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo),
    });
    return res.json();
  },

  async deleteTodo(_id: string): Promise<void> {
    await fetch(`${API_URL}/todos/${_id}`, {
      method: 'DELETE',
    });
  },
};
