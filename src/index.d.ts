type EffectScheduler = {
	scheduler?: Function;
	onStop?: Function;
};

interface Component {
	name?: string;
	render: RenderType;
	setup?: (props: any, arg: SetupParameter) => any;
	props?: any;
	component?: any;
}

type Emit = (event: string, ...arg: any) => void;

interface SetupParameter {
	emit: Emit;
	attr: any;
}

type RenderType = (this: ComponentCtx) => VNode;

interface VNode {
	type: Component | string;
	props?: ComponentProps;
	children?: any;
	el: null | HTMLDivElement;
}

type ComponentProps = {
	[x: string]: any;
};

interface ComponentInstance {
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
}

interface ComponentCtx {
	[x: string]: any;
}
