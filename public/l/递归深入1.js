/*
 * @Author: your name
 * @Date: 2022-05-02 18:26:17
 * @LastEditTime: 2022-05-02 18:26:18
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \模板引擎\src\main copy.js
 */
// 缓存对象
var cache = {}


function fib(n) {
    if (cache.hasOwnProperty(n)) {
        console.log(`命中缓存`, cache)
        return cache[n]
    }
    // 看下标是n是不是0或者1 如果是是返回1
    const v = n == 0 || n == 1 ? 1 : fib(n - 1) + fib(n - 2);
    cache[n] = v
    return v
}



for (let i = 0; i <= 9; i++) {
    const a = fib(i)

    console.log(a)
}
