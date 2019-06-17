import Vue from 'vue';
import App from './App.vue';
 
const root = document.createElement("div");
document.body.appendChild(root);
 
new Vue({
    // 通过h把App组件挂载到html里面，这里只是声明了渲染的是组件App的内容，还需通过$mount挂载到html的一个节点上面
    render: (h) => h(App)
}).$mount(root);