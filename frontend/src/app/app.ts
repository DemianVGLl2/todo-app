import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TasksService, Task } from './tasks';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App implements OnInit {
  tasks: Task[] = [];
  newTitle = '';
  newDescription = '';

  constructor(private tasksService: TasksService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasksService.getAll().subscribe(tasks => {
      this.tasks = tasks;
      this.cdr.detectChanges();
    });
  }

  createTask() {
    if (!this.newTitle.trim()) return;
    this.tasksService.create({
      title: this.newTitle,
      description: this.newDescription
    }).subscribe((newTask) => {
      this.tasks = [...this.tasks, newTask];
      this.newTitle = '';
      this.newDescription = '';
      this.cdr.detectChanges();
    });
  }

  toggleComplete(task: Task) {
    this.tasksService.update(task.id, { completed: !task.completed })
      .subscribe(updated => {
        this.tasks = this.tasks.map(t => t.id === updated.id ? updated : t);
        this.cdr.detectChanges();
      });
  }

  deleteTask(id: number) {
    this.tasksService.delete(id).subscribe(() => {
      this.tasks = this.tasks.filter(t => t.id !== id);
      this.cdr.detectChanges();
    });
  }

  trackById(index: number, task: Task): number {
    return task.id;
  }
}
