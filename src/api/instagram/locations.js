import request from '@/utils/request'

export async function Country(data) {
    return request({
        url: '/instagram/location/country',
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
        url: '/instagram/location/import',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data,

    })
}

export async function Total(data) {
    return request({
        url: '/instagram/location/total',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
