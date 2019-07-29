class ToDo {
	constructor(obj) {
		this.id = obj.id
		this.title = obj.title
		this.tasks = obj.tasks || []
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
		this.urgent = !this.urgent;
	}

	updateTask() {
		
	}
}

class Task {
    constructor(obj) {
        this.id = obj.id;
        this.isCompleted = obj.isCompleted || false;
        this.text = obj.text;
    }
}