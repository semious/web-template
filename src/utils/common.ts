export function subImgName(item:any) {
    let imgSecond = item.substring(item.lastIndexOf("/")+1,item.length);
    let imgSplit = imgSecond.split(".");
    let imgName = imgSplit[0];
    let imgType = imgSplit[1];
    return imgName + "_thumb." + imgType;
}