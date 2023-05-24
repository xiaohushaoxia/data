import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/sms-link/list',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

//create
export async function Import(data) {
    return request({
        url: '/sms-link/import',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data,
    })
}

