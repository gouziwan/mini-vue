/*
 * @Author: your name
 * @Date: 2022-05-02 19:13:25
 * @LastEditTime: 2022-05-02 19:13:26
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \模板引擎\src\main copy.js
 */
// 测试数组
var arr = [1, 2, 3, [4, [4.5, [4.6, [4.7]]], 5], 6, [7, 8], 9]

function convert(arr) {
    let result = [];

    for (let i = 0; i < arr.length; i++) {
        if (typeof arr[i] == "number") {
            result.push({
                value: arr[i]
            })
        } else if (Array.isArray(arr[i])) {
            result.push({
                children: convert(arr[i])
            })
        }
    }

    return result
}


// 转化2 参数不是 arr 而是item 意味这item可能是数组或者是数字
function convertMap(item) {
    if (typeof item == "number") {
        return {
            value: item
        }
    } else if (Array.isArray(item)) {
        return {
            children: item.map(_item => convertMap(_item))
        }
    }
}

console.log(convertMap(arr))

console.log(convert(arr))