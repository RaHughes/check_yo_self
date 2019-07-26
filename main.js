/****************GLOBAL VARIABLES*********************/
var taskInput = document.querySelector('.aside__input1')
var mainSection = document.querySelector('.main__section');
var makeTaskBtn= document.querySelector('.aside__task');
/****************EVENT LISTENERS**********************/
makeTaskBtn.addEventListener('click', buildTask);
/****************FUNCTIONS****************************/

function buildTask() {
	var taskTitle = taskInput.value
	mainSection.insertAdjacentHTML('afterbegin', `<article class='main__section__article'>
						<h2 class='article__h2'>${taskTitle}</h2>
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