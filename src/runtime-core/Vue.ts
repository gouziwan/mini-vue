import { createApp } from "./createApp";
import { h } from "./vnode";
import {
	onMounted,
	getCurrentInstace,
	onBeforeUpdate,
	onUpdated,
	onBeforeMountd,
	onBeforeUninstall
} from "./component";
import { inject, provide } from "./injecct";
import { nextTick } from "../utils/queue";
import { watchEffect } from "../reactivity/effect";
import { ref } from "../reactivity/ref";
import {
	reactive,
	readonly,
	isReactive,
	isReadonly,
	shallowReadonly,
	isProxy
} from "../reactivity/reactive";

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
	onBeforeMountd,
	watchEffect,
	ref,
	reactive,
	readonly,
	isReactive,
	isReadonly,
	shallowReadonly,
	isProxy,
	onBeforeUninstall
};
