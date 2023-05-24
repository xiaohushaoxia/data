import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/sms/list',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
