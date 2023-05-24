import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/config/list',
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
        url: '/config/create',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,

    })
}


//update
export async function Update(data) {
    return request({
        url: '/config/update',
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
        url: '/config/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

