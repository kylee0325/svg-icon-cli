import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import './components/svg-icon/index.js';
import SvgIcon from './components/svg-icon/index.vue';

const app = createApp(App);
app.component(SvgIcon.name, SvgIcon);
app.mount('#app');
