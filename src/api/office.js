import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/office/list',
        method: 'post',
        data,
    })
}

//create
export async function Create(data) {
    return request({
        url: '/office/create',
        method: 'post',
        data,
    })
}

//one
export async function One(data) {
    return request({
        url: '/office/one',
        method: 'post',
        data,
    })
}

//update
export async function Update(data) {
    return request({
        url: '/office/update',
        method: 'post',
        data,
    })
}

//delete
export async function Delete(data) {
    return request({
        url: '/office/delete',
        method: 'post',
        data,
    })
}

