export const extend = Object.assign;

export const isObject = (target: any) => {
	return target !== null && typeof target === "object";
};

export const hasChange = (val: any, newValue: any) => {
	return Object.is(val, newValue);
};

export const isString = (target: any) => {
	return typeof target === "string";
};

export const isArray = (target: any) => {
	return Array.isArray(target);
};

export const isKeyEvent = (key: any) => {
	let req = /^on.+/;
	return req.test(key);
};

// 转换key 值还要 把大小转成小写
export const getEventkey = (key: string, is = false) => {
	key = key.slice(2);

	if (is) key = key.toLocaleLowerCase();

	return key;
};

export function capitalize(str: string) {
	return str.charAt(0).toLocaleUpperCase() + str.slice(1);
}

export function toCapitalizeisOn(str: string) {
	// 如果是就不需要改 就相当 于 onAdd => 输入 onAdd 或者 add 都可以
	return str ? "on" + capitalize(str) : "";
}

export function camelize(str: string) {
	return str.replace(/-(\w+)/g, (_, c: string) => {
		return capitalize(c);
	});
}

export function isFunction(str: string) {
	return Object.prototype.toString.call(str) === "[object Function]";
}
