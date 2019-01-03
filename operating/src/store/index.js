import Vue from 'vue'
import vuex from 'vuex'
Vue.use(vuex);

import user from './modules/user'
import address from './modules/address'
let state={
    activeIndex:'/'
}
export default new vuex.Store({
    state,
   modules:{
    user,
    address
   }

})