'use strict';

// todo-control - наша форма
// header-input - инпут
// todo-list - список дел
// todo-completed - выполенные дела

const isString = function(n) {
  return n.trim() === '' || n === null;
};

const todoControl = document.querySelector('.todo-control'),
      headerInput = document.querySelector('.header-input'),
      todoList = document.querySelector('.todo-list'),
      todoCompleted = document.querySelector('.todo-completed');

let todoData = localStorage.getItem('todoData') ? JSON.parse(localStorage.getItem('todoData')) : [];

const addToStorage = () => {
  localStorage.setItem('todoData', JSON.stringify(todoData));
};

const render = function() {
  todoList.textContent = '';
  todoCompleted.textContent = '';

  todoData.forEach(function(item, i) {
    const li = document.createElement('li');
    li.classList.add('todo-item');

    li.innerHTML = '<span class="text-todo">' + item.value + '</span>' +
        '<div class="todo-buttons">' +
          '<button class="todo-remove"></button>' +
          '<button class="todo-complete"></button>' +
        '</div>';

    if (item.completed) {
      todoCompleted.append(li);
    } else {
      todoList.append(li);
    }

    const btnTodoComplete = li.querySelector('.todo-complete');

    btnTodoComplete.addEventListener('click', function() {
      item.completed = !item.completed;
      render();
      addToStorage();
    });

    const btnTodoRemove = li.querySelector('.todo-remove');

    btnTodoRemove.addEventListener('click', function() {
      todoData.splice(i, 1);
      localStorage.removeItem(todoData[i]);
      render();
      addToStorage();
    });
  });
};

todoControl.addEventListener('submit', function(e) {
  e.preventDefault();

  const newTodo = {
    value: headerInput.value,
    completed: false    
  };

  if (!isString(headerInput.value)) {
    todoData.push(newTodo);
  }

  render();
  addToStorage();

  headerInput.value = '';
});

render();
