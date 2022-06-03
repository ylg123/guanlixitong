// 这模块主要用于获取品牌管理模块的数据
import request from '@/utils/request'

// /admin/product/baseTrademark/{page}/{limit}    get  参数：当前页码数、每页几条数据
// 获取品牌列表数据的接口
export const reqTradeMarkList = (page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

// /admin/product/baseTrademark/save  post  参数：品牌名称、品牌logo
// 新增品牌的接口
// 切记：对于新增的品牌，给服务器传递数据，不需要传递id，id由服务器生成

// /admin/product/baseTrademark/update  put  参数：id、品牌名称、品牌logo
// 修改品牌的接口
// 切记：对于修改某一个品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪一个id的品牌

// 新增和修改的请求接口函数（合在一起，根据传递参数的不同判断是新增还是修改）
export const reqAddOrUpdateTradeMark = (tradeMark)=>{
  // 带给服务器数据携带ID---修改接口
  if(tradeMark.id){
    return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
  }else{
    // 带给服务器数据不携带ID---新增接口
    return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
  }
}

// 删除品牌的接口函数
// /admin/product/baseTrademark/remove/{id}  delete 参数id：品牌id
export const reqDeleteTradeMark = (id)=> request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete',data:id})