const todoList = document.getElementById('list')
const userSelect = document.getElementById('selectOfUser')
const form = document.querySelector('form');
let todos = [];
let users = [];

document.addEventListener('DOMContentLoaded', initapp);
form.addEventListener('submit', handleSubmit);

function handleSubmit(event) {
  event.preventDefault();

  createToDo({
      userId: Number(form.user.value),
      title: form.todo.value,
      completed: false,
  })
}

function handleTodoChange(){
  const todoId = this.parentElement.dataset.id;
  const completed = this.checked;
  toggleTodoComplete(todoId, completed); 
}

function handleClose(){
  const todoId = this.parentElement.dataset.id;
  deleteTodo(todoId);
}

async function deleteTodo(todoId){
  try {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`,{
    method: 'DELETE',
    headers:{
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    removeTodo(todoId);
  }
} catch (error) {
  ErrorForUser(error)
}
}

async function toggleTodoComplete(todoId, completed){
  try {
  const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${todoId}`, {
    method: 'PATCH',
    body: JSON.stringify({completed}),
    headers:{
      'Content-Type': 'application/json',},
  }
  );
  const data = await response.json();
  console.log(data);
  if (!response.ok) {
    throw new Error('Failed to connect, please try again later')
}
} catch (error) {
  ErrorForUser(error)
}
}
function getName(userId){
  const user = users.find(u => u.id === userId);
  return user.name;
}

function printToDo({id, userId, title, complete}) {
  const li = document.createElement('li');
  li.className='listToDo';
  li.dataset.id = id;
  li.innerHTML = `<span>${title} <i><br/>by</i><b> ${getName(userId)}</b></span>`;

  const status = document.createElement('input');
  status.type = 'checkbox';
  status.checked = complete;
  status.addEventListener('change', handleTodoChange);

  const close = document.createElement('span');
  close.innerHTML = '&times;';
  close.className = 'close';
  close.addEventListener('click', handleClose)

  li.prepend(status);
  li.append(close);

  todoList.prepend(li);
}

function initapp(){
  Promise.all([getTodos(), getAllUsers()]).then(values=>{
    [todos, users] = values;
console.log(todos, users);
    todos.forEach((todo) => printToDo(todo));
    users.forEach((user) => createUserOption(user))
  })
}

function createUserOption(user){
  const option = document.createElement('option');
  option.value = user.id;
  option.innerText = user.name;

  userSelect.append(option);
}

function removeTodo(todoId) {
  todos = todos.filter(todo => todo.id !== todoId);

  const todo = todoList.querySelector(`[data-id="${todoId}"]`);
  todo.querySelector('input').removeEventListener('change', handleTodoChange);
  todo.querySelector('.close').removeEventListener('click', handleClose);
  todo.remove();
}

async function getTodos(){
  try {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=15")
  const data = await response.json();

  return data;
} catch (error) {  
  ErrorForUser(error) 
}
}

async function getAllUsers() {
  try {

  const response = await fetch("https://jsonplaceholder.typicode.com/users")
  const data = await response.json();
  return data;

} catch (error) {
  ErrorForUser(error)
}
}

async function createToDo(todo){
  try {
  const response = await fetch ("https://jsonplaceholder.typicode.com/todos", {
    method: 'POST',
    body: JSON.stringify(todo),
    headers: {
      'Content-Type': 'application/json',
    },
  });

const newTodo = await response.json();
printToDo(newTodo);
} catch (error) {
  ErrorForUser(error)
}
}

function ErrorForUser(error){
  alert(error.message)
}