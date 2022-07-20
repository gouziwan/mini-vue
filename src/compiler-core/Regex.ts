export let interpolationRxg = /^\{\{(.+)\}\}/;

export let startTagRxg =
	/^<(\w*(-\w+)?)\s*((\s*(:|@|#)?(\w+-?\w+?)(=?"?([(a-z0-9\u4e00-\u9fa5),\.]*)"?)?)\s*)*?\/?>/;

export let endTagRxg = /^<\/(\w+(-\w+)?)>/;

export let TextRxg = /^(.*)\s*\<\/?[\s\S]+\>/;

// 这个取字符串里面插值文本的
export let TextsRxg = /(\{\{.+\}\})/;

// 这里是用于搜索文本中的字符串的
export let searchTag = /(<\w+>)|(<\/\w+>)/;

export let attrsRxg = /(:|@|#)?(\w+-?\w+)(="(.*?)")?/g;
