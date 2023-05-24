import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/group/list',
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
        url: '/group/create',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,

    })
}

export async function Update(data) {
    return request({
        url: '/group/update',
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
        url: '/group/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
export async function Total(data) {
    return request({
        url: '/group/total',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function Lists(data) {
    return request({
        url: '/group/list2',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
export async function SecondaryAccount(data) {
    return request({
        url: '/instagram/account/secondary-account',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}


