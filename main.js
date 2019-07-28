/****************GLOBAL VARIABLES*********************/
var taskTitleInput = document.querySelector('.aside__input1');
var taskBodyInsert = document.querySelector('.aside__input2');
var mainSection = document.querySelector('.main__section');
var asideTasks = document.querySelector('.aside__tasks');
var makeTaskBtn= document.querySelector('.aside__task');
var mainPrompt = document.querySelector('.main__section--prompt');
var asidePlus = document.querySelector('.aside__plus');
var globalArray = [];
var tasksArray = [];

/****************EVENT LISTENERS**********************/
window.addEventListener('load', initializePage);
makeTaskBtn.addEventListener('click', mainEvent);
asidePlus.addEventListener('click', insertTask);
mainSection.addEventListener('click', removeTask);
mainSection.addEventListener('click', urgentTask);
asideTasks.addEventListener('click', deleteAsideTask)
/****************EVENT HANDLERS***********************/
function mainEvent() {
	removePrompt()
	saveTask()
}

/****************FUNCTIONS****************************/
function initializePage() {
	var tempArray = getExisitingTasks();
	if (tempArray.length > 0) {
		loadTasks(tempArray);
		removePrompt();
	}
}

function getExisitingTasks() {
	return JSON.parse(localStorage.getItem('toDoArray'));
}

function loadTasks(tempArray) {
	tempArray.forEach(function(element) {
		buildTask(element);
		var toDo = new ToDo(element);
		globalArray.push(toDo);
		})
}

function deleteAsideTask(event) {
	event.target.closest('.new__task').remove();
}

function removePrompt() {
	mainPrompt.remove();
}

function insertTask() {
	const task = new Task({
	 id: Date.now(),
	 isCompleted: false,
	 text: taskBodyInsert.value,
	});
	tasksArray.push(task);
	asideTasks.insertAdjacentHTML('afterbegin', `<ul class='new__task' data-id=${task.id}><img src='images/delete.svg' class='aside__task--delete'><p class='.task__body'>${taskBodyInsert.value}</p></ul>`);
	taskBodyInsert.value = '';	
	}

function populateTasks(array) {
   var ulList = `<ul class="article__ul">`;
    tasksArray.forEach(function(taskItem) {
     ulList += `<li class="article__item--li" data-id="${taskItem.id}">
     <img src="images/checkbox.svg" class="article__img--checkbox">
     ${taskItem.text}
     </li>`
  })
  return ulList
}	

function saveTask(toDo, event) {
	if(tasksArray.length === 0 || taskTitleInput.value === '') {
		return 'No inputs'
	}else{
	var toDo = new ToDo({
		id: Date.now(),
		title: taskTitleInput.value,
		tasks: [],
		urgent: false,
	});
	globalArray.push(toDo);
	globalArray[0].updateTask(tasksArray[0])
	toDo.saveToStorage(globalArray);
	buildTask(toDo);
	asideTasks.innerHTML = '';
	taskTitleInput.value = '';
	tasksArray = [];
	}
}
function buildTask(toDo) {
	var taskUrgent = toDo.urgent === false ? 'images/urgent.svg' : 'images/urgent-active.svg';
	mainSection.insertAdjacentHTML('afterbegin', 
		`<article class='main__section__article' data-id='${toDo.id}'>
			<h2 class='article__h2'>${toDo.title}</h2>
			<div class='article__ul'>${populateTasks(globalArray)}</div>
			<footer class='article__footer'>
				<div class='urgent__div'>
					<img src=${taskUrgent} class='article__footer--urgent'><p class='article__footer--urgent--text'>URGENT</p>
				</div>
				<div class='delete__div'>
					<img src=images/delete.svg class='article__footer--delete'><p class='article__footer--delete--text'>DELETE</p>
				</div>
			</footer>
		</article>`);
	}

function removeTask(event) {
	if(event.target.className === 'article__footer--delete') {
		var index = findIndex(event)
		globalArray[index].deleteFromStorage(findId(event));
		event.target.closest('.main__section__article').remove();
	}
}

function findIndex(event) {
	var id = event.target.closest('.main__section__article').dataset.id;
	var getIndex = globalArray.findIndex(obj => {
		return parseInt(id) === obj.id
	});
	return getIndex
}

function findId(event) {
  return event.target.closest('article').dataset.id;
}

function findTaskById(id) {
	var locatedIdea = globalArray.find(eachTaskInArray => eachTaskInArray.id === parseInt(id));
	return locatedIdea   
}

function urgentTask(event) {
	if(event.target.classList.contains('article__footer--urgent')) {
		var targetId = findId(event);
		var targetTask = findTaskById(targetId);
		targetTask.updateTask();
		var taskPath = targetTask.urgent ? 'images/urgent-active.svg' : 'images/urgent.svg';
		event.target.setAttribute('src', taskPath);
		var locatedIndex = findIndex(event);
		globalArray[locatedIndex] = targetTask;
		targetTask.saveToStorage(globalArray);
	}
}