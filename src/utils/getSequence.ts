// 最长递增子序列
function getSequence(arr: any) {
	const p = arr.slice(); //  保存原始数据
	const result = [0]; //  存储最长增长子序列的索引数组
	let i, j, u, v, c;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		const arrI = arr[i];
		if (arrI !== 0) {
			j = result[result.length - 1]; //  j是子序列索引最后一项
			if (arr[j] < arrI) {
				//  如果arr[i] > arr[j], 当前值比最后一项还大，可以直接push到索引数组(result)中去
				p[i] = j; //  p记录第i个位置的索引变为j
				result.push(i);
				continue;
			}
			u = 0; //  数组的第一项
			v = result.length - 1; //  数组的最后一项
			while (u < v) {
				//  如果arrI <= arr[j] 通过二分查找，将i插入到result对应位置；u和v相等时循环停止
				c = ((u + v) / 2) | 0; //  二分查找
				if (arr[result[c]] < arrI) {
					u = c + 1; //  移动u
				} else {
					v = c; //  中间的位置大于等于i,v=c
				}
			}
			if (arrI < arr[result[u]]) {
				if (u > 0) {
					p[i] = result[u - 1]; //  记录修改的索引
				}
				result[u] = i; //  更新索引数组(result)
			}
		}
	}
	u = result.length;
	v = result[u - 1];
	//把u值赋给result
	while (u-- > 0) {
		//  最后通过p数组对result数组进行进行修订，取得正确的索引
		result[u] = v;
		v = p[v];
	}
	return result;
}
export { getSequence };
