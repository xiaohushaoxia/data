import request from '@/utils/request'

export async function UploadImage(data) {
    return request({
        url: '/file/upload_image',
        method: 'post',
        headers: {
            'Content-Type': 'multipart/form-data;charset=UTF-8',
        },
        data,
    })
}
