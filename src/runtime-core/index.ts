import { createApp } from "./createApp";
import { h } from "./vnode";
import {
	onMounted,
	getCurrentInstace,
	onBeforeUpdate,
	onUpdated,
	onBeforeMountd
} from "./component";
import { inject, provide } from "./injecct";
import { nextTick } from "../utils/queue";

export {
	createApp,
	h,
	onMounted,
	getCurrentInstace,
	inject,
	provide,
	nextTick,
	onBeforeUpdate,
	onUpdated,
	onBeforeMountd
};
