'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
      this.form = document.querySelector(form);
      this.input = document.querySelector(input);
      this.todoList = document.querySelector(todoList);
      this.todoCompleted = document.querySelector(todoCompleted);
      this.todoData = new Map(JSON.parse(localStorage.getItem('toDoList')));
      this.todoContainer = document.querySelector('.todo-container');
    }

    addToStorage() {
      localStorage.setItem('toDoList', JSON.stringify([...this.todoData]));
    }

    render() { 
      this.todoCompleted.textContent = '';
      this.todoList.textContent = '';
      this.todoData.forEach(this.createElement, this);
      this.addToStorage();
      this.input.value = '';
    }

    createElement(item) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = item.key;
        li.completed = item.completed;
        li.insertAdjacentHTML('beforeend', `
          <span class="text-todo">${item.value}</span>
          <div class="todo-buttons">
            <button class="todo-remove"></button>
            <button class="todo-complete"></button>
          </div>
        `);

        if (item.completed) {
          this.todoCompleted.append(li);
        } else {
          this.todoList.append(li);  
        }
    }

    generateKey() {
      return Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    }


    deleteItem(target) {
      this.todoData.forEach(item => {
        if (target.key === item.key) {
          this.todoData.delete(item.key);
        }
        
        this.addToStorage();
        this.render();
      });
    }

    completedItem(target) {
      this.todoData.forEach(item => {
        if (target.key === item.key) {
          if (target.completed === true) {
            item.completed = false;
          } else {
            item.completed = true;
          } 
        }

        this.addToStorage();
        this.render();
      });
    }

    handler() {
      this.todoContainer.addEventListener('click', (e) => {
        const target = e.target;

        if (target.matches('.todo-remove')) {
          this.deleteItem(target.closest('.todo-item'));
        } else if (target.matches('.todo-complete')) {
          this.completedItem(target.closest('.todo-item'));
        }
      });
    }

    addTodo(e) {
      e.preventDefault();

      if (this.input.value.trim()) {
        const newTodo = {
          value: this.input.value,
          completed: false,
          key: this.generateKey()
        };

        this.todoData.set(newTodo.key, newTodo);
        this.render();
      } else {
        alert('Пустое дело добавить нельзя!');
      }
    }

    init() {
      this.input.required = true;
      this.render();
      this.handler();
      this.form.addEventListener('submit', this.addTodo.bind(this));
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();