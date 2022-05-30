import { App } from "./App";
import { pares } from "./compiler-core/pares";
import { createApp } from "./runtime-core/index";

// createApp(App).mount("#app");

console.dir(pares(document.querySelector("#app")!.innerHTML));
