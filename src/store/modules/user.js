// 引入登录，退出登录，获取信息的接口函数
import { login, logout, getInfo } from '@/api/user'
// 引入获取token，设置token，删除token的函数
import { getToken, setToken, removeToken } from '@/utils/auth'
// 引入路由模块中重置路由、常量路由、异步路由以及任意路由
import { resetRouter,asyncRoutes,constantRoutes,anyRoutes } from '@/router'
// 引入路由
import router from '@/router'

// 箭头函数返回state对象
const getDefaultState = () => {
  return {
    // 获取token
    token:getToken(),
    // 存储用户名
    name:'',
    // 存储用户头像
    avatar:'',
    // 存储菜单的标记（服务器返回）
    routes:[],
    // 存储按钮权限的标记（服务器返回）
    buttons:[],
    // 存储角色的标记（服务器返回）
    roles:[],
    // 对比之后展示的异步路由【项目中已有的异步路由，与服务器返回的标记信息进行对比最终需要展示的路由】
    resAsyncRoutes:[],
    // 最终用户要展示的所有路由
    resAllRoutes:[]
  }
}

// 存储数据的state
const state = getDefaultState()

// 修改state的mutations
const mutations = {
  // 重置清空state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state,userinfo) => {
    state.name = userinfo.name
    state.avatar = userinfo.avatar
    state.routes = userinfo.routes
    state.buttons = userinfo.buttons
    state.roles = userinfo.roles
  },
  // 存储最终展示路由
  SET_RESASYNCROUTES:(state,resAsyncRoutes)=>{
    // 保存用户需要展示的异步路由，用户需要展示的完整路由有常量+异步+任意路由
    state.resAsyncRoutes = resAsyncRoutes
    // 数组合并并存储最终展示路由
    state.resAllRoutes = constantRoutes.concat(state.resAsyncRoutes,anyRoutes)
    // 给路由添加新的路由
    router.addRoutes(state.resAllRoutes)
  }
}

// 定义一个函数，两个数组进行对比的方法，对比出当前用户到底显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes,routes)=>{
  // 过滤出当前用户需要展示的异步路由
  return asyncRoutes.filter(item=>{
    // 服务器返回的菜单路由标记中有异步路由中的一级路由信息
    if(routes.indexOf(item.name)!==-1){
      // 递归，用于筛选二、三...级路由信息
      if(item.children&&item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true
    }
  })
}

// 要派发的action
const actions = {
  // 这里是user/login的action，处理登录业务
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let res = await login({ username: username.trim(), password: password })
    // mock数据的接口成功的code是20000
    if(res.code===20000){
      // 提交mutations处理state中token数据
      commit('SET_TOKEN', res.data.token)
      // 本地持久化存储token
      setToken(res.data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('file'))
    }
  },

  // 获取用户信息的action
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        // 获取用户信息，返回的数据包含用户名name，用户头像avatar，routes数组【返回的标记：不同的用户应该展示哪些菜单的标记】
        // roles数组【返回的标记：用户的角色】，buttons数组【返回的标记，按钮权限的标记】
        const { data } = response
        // vuex存储用户全部的信息
        commit('SET_USERINFO',data)
        // vuex存储用户最终的展示路由
        commit('SET_RESASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户退出的action
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 用户初始化token的action
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

