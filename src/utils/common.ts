export function subImgName(item:any) {
    if(item) {
        let imgSecond = item.substring(item.lastIndexOf("/")+1,item.length);
        let imgSplit = imgSecond.split(".");
        let imgName = imgSplit[0];
        let imgType = imgSplit[1];
        return imgName + "." + imgType;
    } else {
        return "";
    }

}