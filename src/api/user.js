import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/public/login',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    data,
  })
}

export function getUserInfo(accessToken) {
  return request({
    url: '/admin/info',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/public/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
  })
}
