import Foo from "./component/Foo";
import { h, inject, provide } from "./runtime-core";

export const App: Component = {
	name: "App",
	render() {
		return h("div", [h("p", {}, "provide"), h(AppChild)]);
	},
	setup() {
		provide("bar", "bar");
		provide("Foo", "Foo");
		return {};
	}
};

const AppChild: Component = {
	name: "AppChild",
	render() {
		return h("div", {}, [h("p", {}, `AppChild  => ${this.Foo} ber => ${this.ber}`), h(Foo)]);
	},
	setup() {
		provide("Foo", "AppChildFoo");

		const Foo = inject("Foo");

		const ber = inject("ber", "ber");

		return {
			Foo,
			ber
		};
	}
};
