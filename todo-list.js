class ToDo {
	constructor(obj) {
		this.id = obj.id
		this.title = obj.title
		this.tasks = []
		this.urgent = obj.urgent || false
	}

	saveToStorage(array) {
		localStorage.setItem('toDoArray', JSON.stringify(array));
	}

	deleteFromStorage(index) {
		globalArray = globalArray.filter(indexNum => {
		return parseInt(index) !== indexNum.id});
		this.saveToStorage(globalArray);
	}

	updateToDo() {

	}

	updateTask() {

	}
}