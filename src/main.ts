import { App } from "./App";
import { baseParse } from "./compiler-core/pares";
import { createApp } from "./runtime-core/index";
import { getSequence } from "./utils/getSequence";

createApp(App).mount("#app");

console.log(baseParse("{{ message }}<div></div>"));
