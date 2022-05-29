import { App } from "./App";
import { pares } from "./compiler-core/pares";
import { createApp } from "./runtime-core/index";

createApp(App).mount("#app");

console.log(
	pares(`<div>
            <p>
                测试下 {{ msg }}
            </p>
            今天情况是 -> {{ str }} ,我的心情是 -> {{ mood }} 出去玩咯
            <div>
                哈哈哈
            </div>
        </div>`)
);
