import request from '@/utils/request'
// 获取一级分类的接口
export const reqCategory1List = () => {
  return request({
    url: '/admin/product/getCategory1',
    method: 'GET'
  })
}

// 获取二级分类的接口
export const reqCategory2List = (id) => {
  return request({
    url: `/admin/product/getCategory2/${id}`,
    method: 'GET'
  })
}

// 获取三级分类的接口
export const reqCategory3List = (id) => {
  return request({
    url: `/admin/product/getCategory3/${id}`,
    method: 'GET'
  })
}

// 获取分类属性的接口
// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'GET'
  })
}

// 添加属性与属性值的接口
// POST /admin/product/saveAttrInfo
export const reqAddAttr = (data) => {
  return request({
    url: '/admin/product/saveAttrInfo',
    method: 'POST',
    data
  })
}
