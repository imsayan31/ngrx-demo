import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { addTodo, deleteTodo, toggleTodo } from './store/todos.actions';
import { selectTodos } from './store/todos.selectors';
import { Todo } from './store/todos.reducer';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ngrx-demo');
  newTodo = '';
  private readonly store = inject(Store);
  todos$: Observable<Todo[]> = this.store.select(selectTodos);

  add(): void {
    const todo = this.newTodo.trim();
    if (!todo) return;

    this.store.dispatch(addTodo({ todo }));
    this.newTodo = '';
  }

  toggle(id: string): void {
    this.store.dispatch(toggleTodo({ id }));
  }

  remove(id: string): void {
    this.store.dispatch(deleteTodo({ id }));
  }
}
