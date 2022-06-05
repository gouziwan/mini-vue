import { h, getCurrentInstace, inject } from "../runtime-core/Vue/Vue/Vue";

const Foo: Component = {
	name: "Foo",
	setup() {
		const foo = inject("Foo");
		const bar = inject("bar");
		return { foo, bar };
	},
	render() {
		return h("div", {}, [
			h(FooChild),
			h("div", {}, `Foo组件  foo属性=>${this.foo},bar属性=>${this.bar}`)
		]);
	}
};

const FooChild: Component = {
	name: "FooChild",
	setup() {
		const foo = inject("Foo");
		const bar = inject("bar");
		return { foo, bar };
	},
	render() {
		return h("div", {}, `FooChild  foo属性=>${this.foo},bar属性=>${this.bar}`);
	}
};

export default Foo;
