import request from '@/utils/request'

// GET /admin/product/baseTrademark/{page}/{limit}
// 获取品牌列表
export const reqTradeMarkList = (page, limit) => request(
  { url: `/admin/product/baseTrademark/${page}/${limit}`, method: 'get' }
)

// 添加品牌 POST /admin/product/baseTrademark/save

// 修改品牌 PUT /admin/product/baseTrademark/update

// 删除品牌 DELETE /admin/product/baseTrademark/remove/{id}

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  let url = ''
  if (tradeMark.id) {
    url = `/admin/product/baseTrademark/update`
    return request({ url, method: 'put', data: tradeMark })
  } else {
    url = `/admin/product/baseTrademark/save`
    return request({ url, method: 'post', data: tradeMark })
  }
}

export const reqDeleteTradeMark = (id) => request({
  url: `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})
