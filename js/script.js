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
      li.value = item.value;
      li.style.opacity = 1;
      li.insertAdjacentHTML('beforeend', `
        <span class="text-todo">${item.value}</span>
        <div class="todo-buttons">
          <button class="todo-edit"></button>
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

    animate(target) {
      let value = parseFloat(target.style.opacity);

      const request = setInterval(() => {
          if (value <= 0) {
            clearInterval(request); 
            this.addToStorage();
            this.render();
          }
  
          value -= 0.1;
          target.style.opacity = value;
      }, 50);   
  }

    deleteItem(target) {
      this.todoData.forEach(item => {
        if (target.key === item.key) {
          this.todoData.delete(item.key);
        }

        this.animate(target);
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

        this.animate(target);
      });
    }

    editItem(target) {
      this.todoData.forEach(item => {
        if (target.key === item.key) {
          if (target.children[0].textContent.trim() !== '') {
            item.value = target.children[0].textContent;
          } else {
            alert('Вы оставили поле пустым!');
          }
          
        }

        this.addToStorage();
        this.render();
      });
    }

    handler() {
      this.todoContainer.addEventListener('click', (e) => {
        const target = e.target,
              parent = target.closest('.todo-item');

        if (target.matches('.todo-remove')) {
          this.deleteItem(parent);

        } else if (target.matches('.todo-complete')) {
          this.completedItem(parent);

        } else if (target.matches('.todo-edit')) {
          parent.setAttribute('contenteditable', true);

          parent.addEventListener('blur', () => {
            this.editItem(parent);
          });
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