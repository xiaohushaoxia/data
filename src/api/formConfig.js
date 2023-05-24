import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/form/list',
        method: 'post',
        data,
    })
}

//create
export async function Create(data) {
    return request({
        url: '/form/create',
        method: 'post',
        data,
    })
}

//one
export async function One(data) {
    return request({
        url: '/form/one',
        method: 'post',
        data,
    })
}

//update
export async function Update(data) {
    return request({
        url: '/form/update',
        method: 'post',
        data,
    })
}

//delete
export async function Delete(data) {
    return request({
        url: '/form/delete',
        method: 'post',
        data,
    })
}

