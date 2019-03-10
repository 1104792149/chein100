import Vue from 'vue'
import App from './App'
import api from './js/api';
import common from './js/common';
// import toast from 'pages/dynamic/components/toast.vue';

import './style/main.css';

Vue.config.productionTip = false;
Vue.use(api); // 全局 $api 声明
Vue.use(common); // 全局方法、过滤等声明
App.mpType = 'app';
// Vue.component('toast', toast);
const app = new Vue({
    ...App
});
app.$mount();
