import { App } from "./test/AppChilder";
import { createApp } from "./runtime-core/index";
import { getSequence } from "./utils/getSequence";

createApp(App).mount("#app");

console.log(getSequence([4, 2, 3]));
