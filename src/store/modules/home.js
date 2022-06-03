import mockRequest from '@/utils/mockRequest'
const state = {
  list:{}
}
const actions = {
  // 获取首页mock模拟的数据
  async getData({commit}){
    let res = await mockRequest.get('/home/list')
    if(res.code===20000){
      commit('GETDATA',res.data)
    }
  }
}
const mutations = {
  GETDATA(state,list){
    state.list = list
  }
}
const getters = {}

export default {
  state,
  actions,
  mutations,
  getters
}