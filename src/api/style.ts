import { request } from '@/utils/request'

/*
款式查询
*/
export function getStyleList(params: any) {
    return request({
        url: '/clothes/style/list',
        method: 'get',
        params: params
    })
}

/*
保存新增、修改款式基本信息
*/
export function postStyleSave(params: any) {
    return request({
        url: '/clothes/style/save',
        method: 'post',
        data: params
    })
}

/*
款式信息
*/
export function getStyleDetail(id: any) {
    return request({
        url: '/clothes/style/' + id,
        method: 'get'
    })
}

/*
上传标准码的psd文件
*/
export function uploadPsb(params: any) {
    return request({
        url: '/clothes/upload/psd',
        method: 'post',
        data: params
    })
}

/*
上传CAD图片
*/
export function uploadCad(params: any) {
    return request({
        url: '/clothes/upload/cad',
        method: 'post',
        data: params
    })
}

/*
修改纸样名称
*/
export function modifyPartionRemark(params: any) {
    return request({
        url: '/clothes/partion/remark',
        method: 'post',
        data: params
    })
}

/*
删除样式
*/
export function deleteStyle(id: any) {
    return request({
        url: '/clothes/style/del/' + id,
        method: 'delete'
    })
}
/*
查看图层
*/
export function getLayerList(params: any) {
    return request({
        url: '/clothes/layer/list',
        method: 'get',
        params: params
    })
}


