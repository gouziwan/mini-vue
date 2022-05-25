import { reactive } from "./reactive";
import { hasChange, isObject } from "./../utils/index";
import { track, trigger } from "./effect";

class RefImpl {
	private val: any;
	public __v_isRef = true;
	constructor(private _value: any) {
		this.val = _value;
		this._value = convert(_value);
	}

	get value() {
		track(this, "value");
		return this._value;
	}

	set value(newValue) {
		if (!hasChange(this.val, newValue)) {
			this.val = newValue;
			this._value = convert(newValue);
			trigger(this, "value");
		}
	}
}

function convert(value: any) {
	return isObject(value) ? reactive(value) : value;
}

export function ref(value: any) {
	return new RefImpl(value);
}

export function isRef(val: any) {
	return isObject(val) && !!val.__v_isRef;
}

export function unRef(val: any) {
	if (isRef(val)) {
		return val.value;
	}
	return val;
}

export function proxyRefs(objectWhilet: any) {
	return new Proxy(objectWhilet, {
		get(target, key) {
			return unRef(Reflect.get(target, key));
		},
		set(target, key, value) {
			//判断target是不是ref 对象如果是直接返回.value
			if (isRef(target) && !isRef(value)) {
				return (target[key].value = value);
			} else {
				// 不是直接替换就ok了
				return Reflect.set(target, key, value);
			}
		}
	});
}
