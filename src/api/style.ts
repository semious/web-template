import { request } from '@/utils/request';
// import { StyleDetailInfo } from "./typing";

/*
款式查询
*/
export function getStyleList(params: any) {
    return request({
        url: '/clothes/style/list',
        method: 'post',
        data: params
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

// export function getStyleDetail(id: string): Promise<StyleDetail> {
//     return new Promise((resolve, reject) => {
//       request(`/clothes/style/${id}`).then((res) => {
//         // console.log('res :>> ', res);
//         resolve(res as StyleDetail);
//       }).catch(e => {
//         reject(e);
//       });
//     });
//   }

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
删除分片
*/
export function deletePartion(id: any) {
    return request({
        url: '/clothes/partion/del/' + id,
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

/*
款式的某个尺码的分片列表
*/
export function getPartionListBySize(styleId:any,size: any) {
    return request({
        url: '/clothes/partion/list/' + styleId+ "/"+size,
        method: 'get'
    })
}

/*
款式的所有尺码的分片列表
*/
export function getPartionListByStyleId(styleId:any) {
    return request({
        url: '/clothes/partion/list/' + styleId,
        method: 'get'
    })
}


/*
查看层图
*/
export function getLayerByPartionId(partionId:any) {
    return request({
        url: '/clothes/layer/list/' + partionId,
        method: 'get'
    })
}


/*
解析层图
*/
export function partionSplit(params: any) {
    return request({
        url: '/clothes/partion/split',
        method: 'post',
        data: params
    })
}
