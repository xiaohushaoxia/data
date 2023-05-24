import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/admin/user/list',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data,
  })
}

export function doEdit(data) {
  return request({
    url: '/userManagement/doEdit',
    method: 'post',
    data,
  })
}

export function resetPassword(data) {
  return request({
    url: '/admin/user/reset_password',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data,
  })
}
export function resetRole(data) {
  return request({
    url: '/admin/user/reset_role',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data,
  })
}
export function secret(data) {
  return request({
    url: '/admin/user/otp/secret',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data,
  })
}
export function secretBind(data) {
  return request({
    url: '/admin/user/otp/bind',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data,
  })
}

export function create(data) {
  return request({
    url: '/admin/user/create',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data,
  })
}


export function doDelete(data) {
  return request({
    url: '/userManagement/doDelete',
    method: 'post',
    data,
  })
}
