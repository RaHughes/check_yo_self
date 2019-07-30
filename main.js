/****************GLOBAL VARIABLES*********************/
var taskTitleInput = document.querySelector('.aside__input1');
var taskBodyInsert = document.querySelector('.aside__input2');
var mainSection = document.querySelector('.main__section');
var asideTasks = document.querySelector('.aside__tasks');
var makeTaskBtn= document.querySelector('.aside__task');
var mainPrompt = document.querySelector('.main__section--prompt');
var asidePlus = document.querySelector('.aside__plus');
var clearAll = document.querySelector('.aside__clear');
var globalArray = [];
var tasksArray = [];

/****************EVENT LISTENERS**********************/
window.addEventListener('load', initializePage);
taskTitleInput.addEventListener('keyup', enableMakeBtn)
makeTaskBtn.addEventListener('click', mainEvent);
asidePlus.addEventListener('click', insertTask);
mainSection.addEventListener('click', removeTask);
mainSection.addEventListener('click', urgentTask);
asideTasks.addEventListener('click', deleteAsideTask)
clearAll.addEventListener('click', clearAllAside)
mainSection.addEventListener('click', articleEvent)

/****************EVENT HANDLERS***********************/
function mainEvent() {
	removePrompt()
	saveTask()
}

function articleEvent() {
	toggleDone(event)
}

/****************FUNCTIONS****************************/
function initializePage() {
	disableBtns();
	var tempArray = getExisitingTasks();
	if (tempArray.length > 0) {
		event.preventDefault()
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
		});
}

function removePrompt() {
	mainPrompt.remove();
}

function disableBtns() {
	if (tasksArray.length === 0) {
		clearAll.disabled = true;
		clearAll.classList.add('aside__disabled');		
	}
	if (taskTitleInput.value === '') {
		makeTaskBtn.disabled = true
		makeTaskBtn.classList.add('aside__disabled')
	}
}

function enableMakeBtn() {
	makeTaskBtn.disabled = false
	makeTaskBtn.classList.remove('aside__disabled')
}

function insertTask() {
	const task = new Task({
	 id: Date.now(),
	 isCompleted: false,
	 text: taskBodyInsert.value,
	});
	tasksArray.push(task);
	asideTasks.insertAdjacentHTML('beforeend', 
		`<ul class='new__task' data-id=${task.id}>
		 <img src='images/delete.svg' class='aside__task--delete'>
		 <p class='.task__body'>${taskBodyInsert.value}</p></ul>`);
	taskBodyInsert.value = '';	
	clearAll.disabled = false;
	clearAll.classList.remove('aside__disabled')
	}

function deleteAsideTask(event) {
	event.target.closest('.new__task').remove();
	for (var i = 0; i < tasksArray.length; i++)
		var newTaskIndex = findIndex(event, tasksArray, 'new__task')
		tasksArray.splice(newTaskIndex, 1);
}

function clearAllAside(event) {
	if (tasksArray.length < 0) {
		return
	} else {
		tasksArray = [];
		asideTasks.innerHTML = ''
		taskTitleInput.value = '';
		taskBodyInsert.value = '';
		disableBtns()
	}
}
	
function saveTask(toDo, event) {
	if (tasksArray.length === 0 || taskTitleInput.value === '') {
		return 'No inputs'
	} else {
		var toDo = new ToDo({
		id: Date.now(),
		title: taskTitleInput.value,
		tasks: tasksArray,
		urgent: false,
	});
		globalArray.push(toDo);
		toDo.saveToStorage(globalArray);
		buildTask(toDo);
		asideTasks.innerHTML = '';
		taskTitleInput.value = '';
		tasksArray = [];
		disableBtns()
	}
}

function populateTasks(obj) {
	var ulList = `<ul class="article__ul">`;
	obj.forEach(function(taskItem) {
	var checkBoxPath = taskItem.isCompleted === true ? 'images/checkbox-active.svg' : 'images/checkbox.svg';
	console.log(taskItem)
    var italicStyle = taskItem.isCompleted === true ? 'article__italic' : ''	
		ulList += `<li class='article__item--li ${italicStyle}' data-id='${taskItem.id}'>
		<img src=${checkBoxPath} class='article__img--checkbox' alt='Check off your task'>
		${taskItem.text}
		</li>`
  	})
  return ulList
}

function buildTask(toDo) {
	var taskUrgent = toDo.urgent === false ? 'images/urgent.svg' : 'images/urgent-active.svg';
	var urgentStyle = toDo.urgent === false ? '' : 'main__section__article--urgent';
	var taskDelete = toDo.completed === true ? 'images/delete-active.svg' : 'images/delete.svg';
	mainSection.insertAdjacentHTML('afterbegin', 
		`<article class='main__section__article ${urgentStyle}' data-id='${toDo.id}'>
			<h2 class='article__h2'>${toDo.title}</h2>
			<div class='article__ul'>${populateTasks(toDo.tasks)}</div>
			<footer class='article__footer'>
				<div class='urgent__div'>
					<img src=${taskUrgent} class='article__footer--urgent' alt='Mark a task as urgent'>
					<p class='article__footer--urgent--text'>URGENT</p>
				</div>
				<div class='delete__div'>
					<img src=${taskDelete} class='article__footer--delete' alt='Delete you task after everything is done'>
					<p class='article__footer--delete--text'>DELETE</p>
				</div>
			</footer>
		</article>`);
	}

function removeTask(event) {
	var index = findToDoIndex(event)
	if (globalArray[index].completed === true && event.target.className === 'article__footer--delete') {
		globalArray[index].deleteFromStorage(findId(event));
		event.target.closest('.main__section__article').remove();
	} else if (globalArray[index].completed === false) {
		return 'Not completed mutha fucka'
	}
}


function findIndex(event, array, item) {
  	var id = event.target.closest('.' + item).dataset.id;
  	var getIndex = array.findIndex(function(obj) {
   	 	return parseInt(id) === obj.id
  	});
  	return getIndex
}

function findToDoIndex(event) {
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
	var locatedIdea = globalArray.find(eachTask => eachTask.id === parseInt(id));
	return locatedIdea   
}

function urgentTask(event) {
	if (event.target.classList.contains('article__footer--urgent')) {
		var targetIndex = findIndex(event, globalArray, 'main__section__article');
		var targetToDo = globalArray[targetIndex];
		targetToDo.updateToDo();
		changeStyle(event, targetToDo);
		globalArray[targetIndex].saveToStorage(globalArray);
	}
}

function changeStyle(event, targetToDo) {
	if (targetToDo.urgent === true) {
		event.target.setAttribute('src', 'images/urgent-active.svg');
		event.target.closest('.main__section__article').classList.add('article__footer--urgent--text--active');
		event.target.closest('.main__section__article').classList.add('main__section__article--urgent');
		} else {
		event.target.setAttribute('src', 'images/urgent.svg');
		event.target.closest('.main__section__article').classList.remove('article__footer--urgent--text--active');
		event.target.closest('.main__section__article').classList.remove('main__section__article--urgent');
	}
}

function toggleDone(event) {
	if (event.target.classList.contains('article__img--checkbox')){
		var toDoIndex = findIndex(event, globalArray, 'main__section__article');
  		var listIndex = findIndex(event, globalArray[toDoIndex].tasks, 'article__item--li');
		var task = globalArray[toDoIndex].tasks[listIndex];
		task.isCompleted = ! task.isCompleted;
		changeTaskSvg(event, task, listIndex);
		italics(event);
		checkDeleteButton(event, globalArray, globalArray[toDoIndex]);
  		globalArray[findToDoIndex(event)].saveToStorage(globalArray);
  }
}

function changeTaskSvg(event, task, listIndex) {
  var imgArray = event.target.closest('.main__section__article').querySelectorAll('.article__img--checkbox');
  if (task.isCompleted === true) {
    imgArray[listIndex].setAttribute("src", "images/checkbox-active.svg");
  } else {
    imgArray[listIndex].setAttribute("src", "images/checkbox.svg");
  }
}

function italics(event) {
	var italicToggle = event.target.closest('.article__item--li');
	italicToggle.classList.toggle('article__italic');
}

function checkDeleteButton(event, array, toDo) {
	var dltBtn = event.target.closest('.main__section__article').querySelector('.article__footer--delete');
	dltBtn.disabled = true;
	if (toDo.tasks.every(function(tasks) {
    	return tasks.isCompleted === true
	})) {
  		toDo.completed = true;
  		enableDltBtn(dltBtn)
  	} else {
  		toDo.completed = false;
  		disbableDltBtn(dltBtn)
	}
}

function enableDltBtn(dltBtn) {
	dltBtn.setAttribute("src", "images/delete-active.svg");
	dltBtn.classList.add("article__img--delete--active");
}

function disbableDltBtn(dltBtn) {
	dltBtn.setAttribute("src", "images/delete.svg");
	dltBtn.classList.remove("article__img--delete--active");
}