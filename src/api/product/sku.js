// 这个模块主要用于SKU管理模块发送请求获取数据
// 引入二次封装的axios
import request from '@/utils/request'


// sku模块获取sku数据的接口  GET /admin/product/list/{page}/{limit}
export const reqSkuList = (page,limit) => request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

// sku上架的接口  GET /admin/product/onSale/{skuId}
export const reqOnSale = (skuId) => request({url:`/admin/product/onSale/${skuId}`,method:'get'})

// sku下架的接口  GET /admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

// 获取sku详情的接口  GET /admin/product/getSkuById/{skuId}
export const reqSkuById = (skuId) => request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})
