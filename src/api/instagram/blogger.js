import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/instagram/blogger/list',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function BatchUpdateGroup(data) {
    return request({
        url: '/instagram/blogger/batch-update-group',
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
        url: '/instagram/blogger/import',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data,

    })
}


//delete
export async function Delete(data) {
    return request({
        url: '/instagram/blogger/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

//提交博主关注
export async function FollowTask(data) {
    return request({
        url: '/instagram/blogger/follow-task',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function Total(data) {
    return request({
        url: '/instagram/blogger/total',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })

}
export async function Move(data) {
    return request({
        url: '/instagram/blogger/batch-update-group ',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
