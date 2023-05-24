import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/telegram-client/list',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

//create
export async function Create(data) {
    return request({
        url: '/telegram-client/create',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data,

    })
}


//update
export async function Update(data) {
    return request({
        url: '/telegram-client/update',
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
        url: '/telegram-client/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

