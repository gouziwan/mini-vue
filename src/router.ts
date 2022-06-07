import { createrRouter, createrWebHash } from "./routers";

const router: any[] = [
	{
		name: "Home",
		component: {
			template: `<div>hello world Home</div>`
		},
		path: "/"
	},
	{
		name: "index",
		component: {
			template: `<div>hello world index</div>`
		},
		path: "/index"
	}
];

const routers = createrRouter({
	history: createrWebHash(),
	router
});

export { routers };
