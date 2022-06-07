// 正则表达式
// 解析插值语法的
import { startTagRxg, endTagRxg, TextRxg, TextsRxg, searchTag, attrsRxg } from "./Regex";

import { closedTag, emun } from "./emun";
import { camelize, capitalize, toCapitalizeisOn } from "../utils";

let req = /^(:)/;

let event = /^(@)/;

let slotReq = /^#/;

export function pares(template: string) {
	// 创建一个栈的东西
	// 用于记录闭合标签就合并
	let stack: ChildrenNodes[] = [];

	parestemplate(stack, createContent(template));
	// 这里执行完毕

	return stack[0];
}

function createContent(template: string): ContentTemplate {
	return {
		socucs: template
	};
}

// 解析parestemplate模板的
function parestemplate(stact: ChildrenNodes[], template: ContentTemplate) {
	// 去掉2边的空格
	template.socucs = template.socucs.trim();
	// 解析element元素的
	if (template.socucs.length <= 0) {
		return;
	}
	const s = template.socucs;

	// 解析开始标签的
	if (startTagRxg.test(s)) {
		startTag(stact, template);
	} else if (endTagRxg.test(s)) {
		endTag(stact, template);
	} else if (TextRxg.test(s)) {
		paresText(stact, template);
	}
}

// 解析头部标签的时候
function startTag(stact: ChildrenNodes[], template: ContentTemplate) {
	const arr = template.socucs.match(startTagRxg)!;

	let tag = arr[1];

	const node = createNodes(emun.Element, tag, [], []);

	if (closedTag[tag] || arr[0].lastIndexOf("/") !== -1) {
		stact[stact.length - 1] == null
			? stact.push(node)
			: stact[stact.length - 1].children.push(node);
	} else {
		stact.push(node);
	}

	const len = arr[0].length;

	let attr = arr[0].match(attrsRxg);

	if (attr !== null && attr.length > 0) {
		paresAttrs(node, attr, tag);
	}
	// 解析里面的属性
	template.socucs = template.socucs.slice(len);

	return parestemplate(stact, template);
}

// 碰到结束标签的时候
function endTag(stact: ChildrenNodes[], template: ContentTemplate) {
	const arr = template.socucs.match(endTagRxg)!;

	// 弹出最后一个
	const tag = stact[stact.length - 1].tag;
	if (arr[1] === tag) {
		// 就说明可以把当前的节点给到前一个节点了
		// 还要判断是不是最后一个节点最后一个节点不做处理
		if (stact.length - 2 >= 0) {
			// 把当前的节点给弹出来然后添加到 -2 这个节点上去
			const end = stact.pop();
			stact[stact.length - 1].children.push(end);
			template.socucs = template.socucs.slice(arr[0].length);
			return parestemplate(stact, template);
		}
	} else {
		throw new Error(`模板解析失败 end模板是=>${arr[1]} strte模板=>${tag}`);
	}
}

// 解析文字模板
function paresText(stact: ChildrenNodes[], template: ContentTemplate) {
	let text = template.socucs.match(TextRxg)![1];
	// 需要判断有没有插值语法的
	const arrText: any[] = [];
	let nums = text.search(searchTag);
	if (nums !== -1) {
		text = text.slice(0, nums);
	}
	let len = nums === -1 ? text.length : nums;

	if (TextsRxg.test(text)) {
		paresInterpolation(arrText, text);
	} else {
		arrText.push(text);
	}

	const textNode = createNodes(emun.Text, "", arrText, null);

	stact[stact.length - 1].children.push(textNode);

	template.socucs = template.socucs.slice(len);

	return parestemplate(stact, template);
}

// 解析文本里面的插值语法
function paresInterpolation(arr: any, text: string) {
	let currentIndex = 0;

	while (currentIndex <= text.length) {
		const nums = text.indexOf("{{");
		if (nums !== 0) {
			// 不等于0 这个是截取之前的情况
			arr.push(text.slice(0, nums));
			text = text.slice(nums);
		} else {
			const end = text.indexOf("}}");
			const interpolation = text
				.slice(nums, end + 2)
				.replace(/(\{\{)|(\}\})/g, "")
				.trim();

			arr.push({
				type: "interpolation",
				value: interpolation
			});
			text = text.slice(end + 2);
		}
		currentIndex++;
	}
}

// 解析文本里面的属性
function paresAttrs(node: ChildrenNodes, attrs: any, tag: string) {
	let arr: any[] = [];

	for (let i = 0; i < attrs.length; i++) {
		let [name, value] = attrs[i].split("=");

		if (name === tag) {
			// 标签跳过
			continue;
		}

		if (req.test(name)) {
			let attNode = createdAttrs(name, value === undefined ? true : value.replace(/\"/g, ""));
			arr.push(attNode);
		} else if (event.test(name)) {
			let evnetNode = createdEvenet(name, value);
			arr.push(evnetNode);
		} else if (slotReq.test(name)) {
			name = name.replace(slotReq, "");
			node.slot = name;
		} else {
			// 普通的属性
			let attNode = createdAttrs(name, value);
			arr.push(attNode);
		}
	}

	node.attrs = arr;

	return arr;
}

function createNodes(
	type: string,
	tag: string,
	children: any[],
	attrs?: any[] | null,
	slot?: any
): ChildrenNodes {
	return {
		type,
		tag,
		children,
		attrs,
		slot,
		_isVnode: false
	};
}

function createdAttrs(name: string, value: string) {
	return {
		name: name.replace(req, ""),
		value: value === undefined ? true : value
	};
}

function createdEvenet(name: string, value: any) {
	name = toCapitalizeisOn(camelize(name.replace(event, "")));

	return {
		name,
		value: value.replace(/\"/g, "")
	};
}
