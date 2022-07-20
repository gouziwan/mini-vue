import { createrRouter, createrWebHash } from "./routers";

const Home: Component = {
	template: `<div>hello world Home</div>`,
	name: "Home"
};

const Index: Component = {
	template: `<div>hello world index</div>`,
	name: "Index"
};

const router: any[] = [
	{
		name: "Home",
		component: Home,
		path: "/"
	},
	{
		name: "index",
		component: Index,
		path: "/index"
	}
];

const routers = createrRouter({
	history: createrWebHash(),
	router
});

export { routers };
