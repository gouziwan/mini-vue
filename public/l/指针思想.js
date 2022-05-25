const str = 'ababababababwwwwwewwwwqqqqqqsssss'

let i = 0;

let j = 1;

let max = 0

while (str.length >= j) {
    if (str[i] !== str[j]) {
        const nums = j - i
        if (nums > max) max = nums

        i = j;
    }
    j++;
}

