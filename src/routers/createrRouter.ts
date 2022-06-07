import { h } from "../runtime-core/vnode";
import { reactive } from "../reactivity/reactive";
import { ref } from "../reactivity/ref";
import { watchEffect } from "../reactivity/effect";
import { globalComponents } from "../runtime-core/createApp";

let currentRoute: RouterOptions = {
	history: undefined,
	router: []
};

let currentRouters = {};

export function createrRouter(options: RouterOptions) {
	const { history, router } = options;

	options.history = reactive(options.history);

	currentRouters = {
		push: history.push
	};

	initRouterModel(options);

	return {
		install
	};
}

/*实现 router-view */
function install(app: CreateApp) {
	app.components("router-view", {
		setup() {
			const router = currentRoute;

			const component = ref(getCurrentRouter(router));

			watchEffect(() => {
				component.value = getCurrentRouter(router);
			});

			return {
				component
			};
		},
		render() {
			return h("div", {}, [h(globalComponents.get("components")!, { is: this.component }, null)]);
		}
	});
}

// 初始化路由
export function initRouterModel(options: RouterOptions) {
	location.hash = options.history.base;
	currentRoute = options;
	window.addEventListener("hashchange", () => {
		options.history.base = window.location.hash.replace(/^#/, "");
	});
}

export function useRoute() {
	return currentRoute;
}

export function useRouter() {
	return currentRouters;
}

export function getCurrentRouter(options: any) {
	const base = options.history.base;

	const arr = options.router.filter((el: any) => el.path === base)[0];

	return arr.component;
}
