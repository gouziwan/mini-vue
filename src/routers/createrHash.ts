import { useRoute } from "./createrRouter";

// hash模式
export function createrWebHash() {
	return {
		base: "/",
		push
	};
}

function push(to: string) {
	const { router } = useRoute();
	let path = "";
	path = router.filter(el => el.name === to || el.path === to)[0].path;

	console.log(path);

	location.hash = path;
}
