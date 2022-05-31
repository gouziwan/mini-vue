export let interpolationRxg = /^\{\{(.+)\}\}/;

export let startTagRxg = /^<(\w+(-\w+)?)((\s*(:|@|#)?(\w+-?\w+?)(=?"?(.+)"?)?))*\/?>/;

export let endTagRxg = /^<\/(\w+(-\w+)?)>/;

export let TextRxg = /^(.*)\s*\<\/?[\s\S]+\>/;

// 这个取字符串里面插值文本的
export let TextsRxg = /(\{\{.+\}\})/;

// 这里是用于搜索文本中的字符串的
export let searchTag = /(<\w+>)|(<\/\w+>)/;

export let attrsRxg = /(:|@|#)?(\w+-?\w+)(="(.*?)")?/g;
