import request from '@/utils/request'

export async function List(data) {
    return request({
        url: '/instagram/users/list',
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
        url: '/instagram/users/import',
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
        url: '/instagram/users/delete',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function Total(data) {
    return request({
        url: '/instagram/users/total',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
export async function LanguageMap(data) {
    return request({
        url: '/instagram/users/language-map',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}

export async function Export(data) {
    return request({
        url: '/instagram/users/export',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
export async function Follower(data) {
    return request({
        url: '/instagram/users/collect-follower',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
export async function Following(data) {
    return request({
        url: '/instagram/users/collect-following',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
//语言
export async function Language(data) {
    return request({
        url: '/instagram/users/detect-language',
        method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
}
//获取国家
export function Country(data) {
    return request({
      url: '/instagram/location/country',
      method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
  }
  //获取城市
  export function City(data) {
    return request({
      url: '/instagram/location/city',
      method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
  }
    //获取地区
  export function Location(data) {
    return request({
      url: '/instagram/location/location',
      method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
  }

  //地区采集
  export function CollectLocation(data) {
    return request({
      url: '/instagram/users/collect-location',
      method: 'post',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        data,
    })
  }
  