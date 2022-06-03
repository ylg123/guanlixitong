// 这个模块主要用于属性管理模块发送请求获取数据
// 引入二次封装的axios
import request from '@/utils/request'

// 获取一级分类的数据接口 GET /admin/product/getCategory1
export const reqCategory1List = () => request({url:'/admin/product/getCategory1',method:'get'})

// 获取二级分类的数据接口 GET /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

// 获取三级分类的数据接口 GET /admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id) => request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// 获取商品属性的数据接口 GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 添加属性或修改属性保存的接口 POST /admin/product/saveAttrInfo  参数为一个对象
export const reqAddOrUpdateSaveAttr = (data) => request({url:'/admin/product/saveAttrInfo',method:'post',data})
/*参数对象 {
  "attrName": "string", 属性名
  "attrValueList": [    属性名中的属性值，因为属性值可以多个，所以写成数组
    {
      "attrId": 0,  某个属性值中的属性id
      "valueName": "string"  某个属性值中的属性值
    }
  ],
  "categoryId": 0,  三级分类的id
  "categoryLevel": 3,  三级分类
} */