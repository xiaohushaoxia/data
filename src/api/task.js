import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/task/list',
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
        url: '/task/create',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data,

    })
}

export async function Update(data) {
    return request({
        url: '/task/update',
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
        url: '/task/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
export async function Stop(data) {
    return request({
        url: '/task/stop',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
//拉群列表
export async function pullGroupList(data) {
    return request({
        url: 'task/ig-task-log-list',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
//拉群详情
export async function pullGroupDetail(data) {
    return request({
        url: 'task/ig-task-log-detail',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

