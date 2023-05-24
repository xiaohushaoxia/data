import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function List(data) {
  return request({
    url: '/employee/list',
    method: 'post',
    data,
  })
}

//create
export async function Create(data) {
    return request({
        url: '/employee/create',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

//one
export async function One(data) {
    return request({
        url: '/employee/one',
        method: 'post',
        data,
    })
}

//update
export async function Update(data) {
    return request({
        url: '/employee/update',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

//delete
export async function Delete(data) {
    return request({
        url: '/employee/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

///upload_image
export async function UploadImage(data) {
    return request({
        url: '/file/upload_image',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data,
    })
}

