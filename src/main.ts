import { App } from "./App";
import { pares } from "./compiler-core/pares";
import { createApp } from "./runtime-core/index";

// createApp(App).mount("#app");

console.log(
	pares(`
        <div id="app" :class="appage" :id="class" @onClick="age" age-name> 
            <My-Input :name="test ? '你好啊!' : '我不好' ">
                <template #name>
                    <li v-for="(item,index) in list">
                        {{item}}
                    </li>
                </template>
                <template>
                    <li v-for="(item,index) in list">
                        {{item}}
                    </li>
                </template>
            </My-Input>
            <input type="button" value="点击按钮">
            <p>
                测试下 {{ msg }}
            </p>
            今天情况是 -> {{ str }} ,我的心情是 -> {{ mood }} 出去玩咯
            <div>
                哈哈哈
            </div>
        </div>
        `)
);
