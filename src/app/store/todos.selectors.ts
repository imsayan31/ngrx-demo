import { createSelector, createFeatureSelector } from '@ngrx/store';
import { Todo } from './todos.reducer';

export const selectTodos = createFeatureSelector<Todo[]>('todos');
export const selectCompletedTodos = createSelector(selectTodos, todos => todos.filter(t => t.done));
