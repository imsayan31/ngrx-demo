import { createAction, props } from '@ngrx/store';

export const addTodo = createAction('[Todos] Add Todo', props<{ todo: string }>());
export const toggleTodo = createAction('[Todos] Toggle Todo', props<{ id: string }>());
export const deleteTodo = createAction('[Todos] Delete Todo', props<{ id: string }>());