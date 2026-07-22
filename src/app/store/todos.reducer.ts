import { createReducer, on } from '@ngrx/store';
import { addTodo, toggleTodo, deleteTodo } from './todos.actions';

export interface Todo { id: string; title: string; done: boolean; }
export const initialState: Todo[] = [];

export const todosReducer = createReducer(
  initialState,
  on(addTodo, (state, { todo }) => [...state, { id: Date.now().toString(), title: todo, done: false }]),
  on(toggleTodo, (state, { id }) => state.map(todo => todo.id === id ? { ...todo, done: !todo.done } : todo)),
  on(deleteTodo, (state, { id }) => state.filter(todo => todo.id !== id))
);