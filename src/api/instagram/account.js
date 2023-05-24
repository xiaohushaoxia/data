import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/instagram/account/list',
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
        url: '/instagram/account/import',
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
        url: '/instagram/account/update',
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
        url: '/instagram/account/delete',
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
        url: '/instagram/account/check',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function Total(data) {
    return request({
        url: '/instagram/account/total',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function Clear(data) {
    return request({
        url: '/instagram/account/clear',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function Export(data) {
    return request({
        url: '/instagram/account/export',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function BatchDelete(data) {
    return request({
        url: '/instagram/account/batch-delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}


export async function Move(data) {
    return request({
        url: '/instagram/account/batch-update-group',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}