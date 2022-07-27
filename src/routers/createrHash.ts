import { useRoute, useRouter } from "./createrRouter";

// hash模式
export function createrWebHash() {
	return {
		base: "/",
		modules: "hash"
	};
}
