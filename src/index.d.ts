type EffectScheduler = {
	scheduler?: Function;
	onStop?: Function;
};

interface Component {
	name?: string;
	render?: RenderType;
	setup?: (props: any, arg: SetupParameter) => any;
	props?: any;
	component?: any;
	template?: string;
}

type Emit = (event: string, ...arg: any) => void;

interface SetupParameter {
	emit: Emit;
	attr: any;
}

type RenderType = (this: ComponentCtx) => VNode;

interface VNode {
	component?: {};
	type: Component | string;
	props?: ComponentProps;
	children?: any;
	el: null | HTMLDivElement;
	key: any;
	_install: null | ComponentInstance;
}

type ComponentProps = {
	[x: string]: any;
};

interface ComponentInstance {
	name?: string;
	state: any;
	_component: VNode.type;
	_vnode: VNode;
	_render: RenderType | null;
	_ctx: null | Proxy;
	$el?: HTMLDivElement;
	props: ComponentProps;
	emit: (install: ComponentInstance) => Emit;
	on?: null | {
		[x: string]: Function;
	};
	attr?: null;
	$slots: any;
	mounted?: Function;
	provides: Map;
	parent: ComponentInstance;
	_subTree: null | VNode;
	updatedComponent: any;
	activity: Activity;
	_components: any;
}

interface ComponentCtx {
	[x: string]: any;
	$el: HTMLDivElement | null;
	$props: any;
	slots: any;
	$attr: any;
}

interface Activity {
	onBeforeMountd?: Function;
	onMounted?: Function;
	onBeforeUpdate?: Function;
	onUpdated?: Function;
}

interface ContentTemplate {
	socucs: string;
}

interface ChildrenNodes {
	type: string;
	tag: string;
	children: any[];
	attrs?: any[] | null;
	slot?: any;
}
