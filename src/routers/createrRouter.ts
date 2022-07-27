import { isArray, isObject, isString } from "./../utils/index";
import { h } from "../runtime-core/vnode";
import { reactive } from "../reactivity/reactive";
import { ref } from "../reactivity/ref";
import { watchEffect } from "../reactivity/effect";
import { globalComponents } from "../runtime-core/createApp";

let currentRoute: Router = reactive({
	name: "",
	path: "",
	query: {}
});

let currentRouters = {
	push
};

let optionsValue: RouterOptions | null = null;

export function createrRouter(options: RouterOptions) {
	optionsValue = options;
	initRouterModel(options);
	return {
		install
	};
}

// push 函数
function push(state: string | RouterPushState) {
	// 先判断是 hash 模式 还是 histroy模式
	if (optionsValue!.history.modules == "hash") {
		hashPush(state);
	}
}

// hash模式的 state 只能接收 index -> '/index'
function hashPush(value: string | RouterPushState) {
	// 如果是是string 后面还可以这样携带参数 /index?age=123;
	if (typeof value === "string") {
		location.href = location.origin + "/#" + value;
	} else {
		const { path, name, state } = value;
		// path -> name
		const component = optionsValue!.router.filter(el => {
			if (el.path === path || el.name === name) {
				return el;
			}
		})[0];

		if (!isObject(component)) {
			console.warn(`你是否正确的注册了路由对象?`);
			return;
		}

		let p = component.path;

		if (isObject(state)) {
			p +=
				"?" +
				Object.keys(state)
					.map(k => `${k}=${state[k]}`)
					.join("&");
		}

		location.href = location.origin + "/#" + p;
	}
}

const RouterView: Component = {
	name: "RouterView",
	setup() {
		const components = ref(getCurrentRouter(optionsValue!).component);

		window.addEventListener(
			"hashchange",
			() => (components.value = getCurrentRouter(optionsValue!).component)
		);

		return {
			components
		};
	},
	render() {
		return h("div", {}, [h(this.components, {}, null)]);
	}
};

const RouterLike: Component = {
	name: "RouterLike",
	props: ["to"],
	setup() {
		return {};
	},
	render() {
		return h(
			"a",
			{
				onClick: e => {
					e.preventDefault();
					push(this.$props.to);
				}
			},
			[this.$slots.default()]
		);
	}
};

/*实现 router-view */
function install(app: CreateApp) {
	app.config.route = reactive(currentRoute);
	app.config.router = currentRouters;
	app.components("router-view", RouterView);
	app.components("router-like", RouterLike);
}

// 初始化路由
function initRouterModel(options: RouterOptions) {
	location.hash = options.history.base;
	routeUpdate(getCurrentRouter(options));
	window.addEventListener("hashchange", () => {
		routeUpdate(getCurrentRouter(options));
	});
}

function routeUpdate(component: any) {
	if (component == undefined) return;
	currentRoute.path = component.path;
	currentRoute.name = component.name;
	currentRoute.query = getQueryParameter();
	currentRoute.meta = component.meta || {};
}

function getQueryParameter() {
	let data = {} as any;

	let req = /\?(.+)/;

	const arr = location.hash.match(req);

	if (isArray(arr)) {
		const value = arr![1];

		if (isString(value)) {
			const parmeArr = value.split("&");
			parmeArr.forEach(el => {
				const [key, value] = el.split("=");
				data[key] = value;
			});
		}
	}

	return data;
}

export function useRoute() {
	return currentRoute;
}

export function useRouter() {
	return currentRouters;
}

export function getCurrentRouter(options: RouterOptions) {
	const component = options.router.filter(el => {
		return location.hash.split("?")[0].replace(/^#/, "") === el.path;
	})[0];

	return component;
}
