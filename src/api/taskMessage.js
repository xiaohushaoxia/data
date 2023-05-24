import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/task-message/list',
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
        url: '/task-message/create',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,

    })
}

export async function Update(data) {
    return request({
        url: '/task-message/update',
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
        url: '/task-message/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

// 添加群发任务
export async function AddTask(data) {
    return request({
        url: 'task-message/ig-create-group-task',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}



export async function SendTask(data) {
    return request({
        url: '/task-message/send-task',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}


