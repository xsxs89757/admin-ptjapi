## vue-element-admin
#### 1.安装
>`npm install || yarn`   
`npm run dev || yarn dev`
#### 2.配置文件
>.env.development `VUE_APP_BASE_API`修改为你的测试api地址  
.env.production  `VUE_APP_BASE_API` 正式地址修改  
如果要更改项目title 需要修改vue.config.js 中的name默认项，由于延迟加载的原因如果不修改会出现一个小BUG
###### `/src/setting.js`  
>该文件内为整体配置项  
`showLanguage=false`可以关闭语言的显示  
####3.权限
>1.使用指令的方式操作权限`v-permission="'menu.editMenu'"`  
2.使用函数方式操作权限  
`import checkPermission from '@/utils/permission'`  
`methods: {checkPermission}`  
`v-if="(!scope.row.is_external_link && !scope.row.hidden && checkPermission('menu.addMenu'))"`  
正常情况下请使用指令方式操作权限，如果需要多重判断权限的情况请使用函数方式  
####4.创建新view
>`npm run new || yarn new`  
####5.目录　
>src/api api地址目录  
src/components 组件库  
src/directive 自定义指令库  
src/icons/svg 所有svg图片，菜单中使用的都是这里面的，如果有先添加请直接去<https://www. iconfont.cn/>下载svg图片放到文件家中，系统会自动读取当前文件夹下面的svg图片  
src/lang 多语言  
src/layout 整体布局  
src/router 路由  
src/store vuex   
src/styles less  
src/utils 可引入的其他js 其中request 为封装的axios 头部请求全部添加了Authorization 与x-lang  x-lang 默认为zh  
src/views 视图  
src/main.js  
src/permission.js 登录与权限的获取  

