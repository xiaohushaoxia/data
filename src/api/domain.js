import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/target_domain/list',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}


export async function Update(data) {
    return request({
        url: '/target_domain/update',
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
        url: '/target_domain/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
// 导入
export async function Import(data) {
    return request({
        url: '/target_domain/upload',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        timeout:30000,
        data,
    })
}

// 下载
export async function Download(data) {
    return request({
        url: '/target_domain/download',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

