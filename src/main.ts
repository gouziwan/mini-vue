import { App, Apps } from "./App";
import { createApp } from "./runtime-core/index";

createApp(App).mount("#app");

createApp(Apps).mount("#txt");
