import Vue from 'vue'
// import { Button } from 'element-ui'
// import { Form, FormItem } from 'element-ui'
// import { Input } from 'element-ui'
// import { Message } from 'element-ui';//弹框组件

import { Button, Form, FormItem, Input, Message,Container, Header, Aside, Main, Submenu, Menu, MenuItem,Breadcrumb, BreadcrumbItem,Card,Row,Col, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, MessageBox} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
// 自定义属性，通过this访问到message
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
