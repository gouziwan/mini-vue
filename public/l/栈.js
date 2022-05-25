// 栈解题   2[3[a]4[1[b]2[c]]]

/**
 * 解题思路 准备2栈区  一个数字 一个是存放方括号的
 * 遍历每一个字符如果这个字符是数字那么就把数字压栈 把空字符串压栈
 * 
 * 
 */



const str = `3[2[b]1[c]]`


function smartRepeat(templateStr) {
    // 指针
    let index = 0;
    // 栈1 存放数字
    var stack1 = [];
    // 栈2 存放字符串
    var stack2 = [];

    let rest = ''

    while (index < templateStr.length - 1) {
        rest = templateStr.substring(index)

        if (/^\d+\[/.test(rest)) {
            let nums = rest.match(/^(\d+)\[/)[1] * 1;
            // 这里是让指针后移动 ，nums 这个数字是多少位就后移动多少位加1
            // 为什么要加1呢加1位是[。
            index += nums.toString().length + 1;
            // 如果是数字就把数字压栈然后再把空字符串压栈
            stack1.push(nums);
            // 压入空字符串
            stack2.push('')

            // console.log(nums)
        } else if (/^\w+\]/.test(rest)) {
            // 这里是如果首第一个是字母的话
            let s = rest.match(/^(\w+)\]/)[1];
            stack2[stack2.length - 1] = s;
            index += s.length;
        } else if (rest[0] === "]") {
            let nums = stack1.pop();
            let word = stack2.pop();
            stack2[stack2.length - 1] += word.repeat(nums);
            index++;
        } else {
            index++
        }

        console.log(index, stack1, stack2)
    }


    return stack2[0].repeat(stack1[0])
}


smartRepeat(str)
