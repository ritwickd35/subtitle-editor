import "./assets/main.css";
import ToastService from "primevue/toastservice";
import PrimeVue from "primevue/config";
import Toast from "primevue/toast";
import "@/assets/main.css";
import "primevue/resources/themes/lara-light-teal/theme.css";
import "bootstrap/dist/css/bootstrap.css";
import "primevue/resources/primevue.min.css";
import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(createPinia());
app.use(router);
app.component("Toast", Toast);

app.mount("#app");
