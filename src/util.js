class Queue {
	constructor() {
		this.queue = [];
	}

	enqueue(value) {
		return this.queue.push(value);
	}

	dequeue() {
		return this.queue.shift();
	}

	size() {
		return this.queue.length;
	}
}

class Stack {
	constructor() {
		this.stack = [];
	}

	push(value) {
		return this.stack.unshift(value);
	}

	pop() {
		return this.stack.shift();
	}

	size() {
		return this.stack.length;
	}
}

module.exports = {
	Queue,
	Stack
};
