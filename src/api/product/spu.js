// 这个模块主要用于SPU管理模块发送请求获取数据
// 引入二次封装的axios
import request from '@/utils/request'

// 获取SPU列表的接口  GET /admin/product/{page}/{limit} 参数：page limit category3Id
export const reqSpuList = (page,limit,category3Id) => request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

// 获取SPU数据的接口  GET /admin/product/getSpuById/{spuId}
export const reqSpu = (spuId) => request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

// 获取品牌数据的接口  GET /admin/product/baseTrademark/getTrademarkList
export const reqTrademark = () => request({url:`/admin/product/baseTrademark/getTrademarkList`,method:'get'})

// 获取图片数据的接口  GET /admin/product/spuImageList/{spuId}
export const reqImage = (spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取销售属性数据的接口（一共3个）  GET /admin/product/baseSaleAttrList
export const reqSaleAttr = () => request({url:`/admin/product/baseSaleAttrList`,method:'get'})

// 修改|添加spu数据的接口 （携带参数有id修改，参数没id为添加）
// 修改spu接口 POST /admin/product/updateSpuInfo  添加spu接口 POST /admin/product/saveSpuInfo
export const reqUpdateOrAddSpu = (spuInfo) => {
  if(spuInfo.id){
    return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
  }else{
    return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
  }
}

// 删除spu数据的接口 DELETE /admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId) => request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})

// 获取SPU图片数据的接口 GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取SPU销售属性数据的接口 GET /admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttrList = (spuId) => request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})

// 获取属性信息数据的接口 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加sku的接口  POST /admin/product/saveSkuInfo
export const reqAddSku = (skuInfo) => request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})

// 获取SKU列表数据的接口  GET /admin/product/findBySpuId/{spuId}
export const reqSkuList = (spuId) => request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})
