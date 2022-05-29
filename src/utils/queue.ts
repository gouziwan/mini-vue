const queue: any[] = [];

let is = true;

export function addQueue(instace: ComponentInstance) {
	const fn = instace.updatedComponent;
	if (!queue.includes(fn)) {
		instace.activity.onBeforeUpdate && instace.activity.onBeforeUpdate();
		queue.push(fn);
	}
	if (is) {
		exec();
	}
}

export function exec() {
	is = false;
	nextTick(() => {
		let _fn;
		while ((_fn = queue.shift())) {
			_fn && _fn();
		}
		is = true;
	});
}

export function nextTick(fn?: Function) {
	return fn instanceof Function ? Promise.resolve().then(() => fn()) : Promise.resolve();
}
