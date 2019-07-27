/****************GLOBAL VARIABLES*********************/
var taskTitleInput = document.querySelector('.aside__input1');
var taskBodyInsert = document.querySelector('.aside__input2');
var mainSection = document.querySelector('.main__section');
var asideTasks = document.querySelector('.aside__tasks');
var makeTaskBtn= document.querySelector('.aside__task');
var mainPrompt = document.querySelector('.main__section--prompt');
var asidePlus = document.querySelector('.aside__plus');
var globalArray = [];

/****************EVENT LISTENERS**********************/
window.addEventListener('load', initializePage);
makeTaskBtn.addEventListener('click', mainEvent);
asidePlus.addEventListener('click', insertTask);
mainSection.addEventListener('click', removeTask);
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

function removePrompt() {
	mainPrompt.remove();
}

function insertTask() {
	var taskInsert = taskBodyInsert.value;
	asideTasks.insertAdjacentHTML('afterbegin', `<ul class='new__task'><img src='images/delete.svg' class='aside__task--delete'><p class='.task__body'>${taskInsert}</p></ul>`);
	taskBodyInsert.value = '';
	}

function saveTask() {
	var toDo = new ToDo({
		id: Date.now(),
		title: taskTitleInput.value,
		tasks: [],
		urgent: false,
	});
	globalArray.push(toDo);
	toDo.saveToStorage(globalArray);
	buildTask(toDo);
	taskTitleInput.value = '';
}
function buildTask(toDo) {
	mainSection.insertAdjacentHTML('afterbegin', 
		`<article class='main__section__article' data-id='${toDo.id}'>
			<h2 class='article__h2'>${toDo.title}</h2>
			<ul class='article__ul'>stuff</ul>
			<footer class='article__footer'>
				<div class='urgent__div'>
					<img src='images/urgent.svg' class='article__footer--urgent'><p class='article__footer--urgent--text'>URGENT</p>
				</div>
				<div class='delete__div'>
					<img src='images/delete.svg' class='article__footer--delete'><p class='article__footer--delete--text'>DELETE</p>
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