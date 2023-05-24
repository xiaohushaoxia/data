import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/sessions/list',
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
        url: '/sessions/import',
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
        url: '/sessions/update',
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
        url: '/sessions/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

//check
export async function Check(data) {
    return request({
        url: '/sessions/check',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function Total(data) {
    return request({
        url: '/sessions/total',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function Clear(data) {
    return request({
        url: '/sessions/clear',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
