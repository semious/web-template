import CryptoJS from 'crypto-js';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

const publicKey = "TOKEN_4884d5af-bc71-4fd2-99b8-20b59a653cbe";
const privateKey = "2f7b40d1-7279-4c26-a675-4b71f5b22d3b";
// const bucketName = "sdimg";
const bucketName = "tgweb";
const distPath = path.resolve(__dirname, '../dist');

export async function upload(filePath: string) {
  // console.log('filePath :>> ', filePath);
  // return;
  const fileType = path.extname(filePath).replace('.', '');
  let contentType = ''
  switch (fileType) {
    case "js":
      contentType = "application/javascript";
      break;
    case "css":
      contentType = "text/css";
      break;
    case "json":
      contentType = "application/json";
      break;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      contentType = `image/${fileType}`;
      break;
    default:
  }
  const data = fs.readFileSync(filePath);
  const uploadPath = 'public/fortune-admin/' +filePath.replace(distPath + '/', '');
  // console.log('uploadPath :>> ', uploadPath);
  // return;
  const auth = sign("PUT", publicKey, privateKey, "", contentType, "", bucketName, `${uploadPath}`)
  const cdnUrl = `https://tg.yuanzixx.cn/${uploadPath}`;
  console.log('cdnUrl :>> ', cdnUrl);
  const res = await axios.request({
    url: `https://${bucketName}.cn-wlcb.ufileos.com/${uploadPath}`,
    method: "PUT",
    headers: {
      'Authorization': auth,
      'content-type': contentType,
    },
    data,
  });
  // console.log('res :>> ', res);
}

const sign = (method: string, publicKey: string, privateKey: string, md5: string, contentType: string, date: string, bucketName: string, imagePath: string) => {
  //这里使用了crypto-js加密算法库，安装方法会在后面说明
  const CanonicalizedResource = `/${bucketName}/${imagePath}`;
  const StringToSign = method + "\n"
    + md5 + "\n"
    + contentType + "\n"
    + date + "\n"
    + CanonicalizedResource //此处的md5以及date是可选的，contentType对于PUT请求是可选的，对于POST请求则是必须的
  const sign = CryptoJS.HmacSHA1(StringToSign, privateKey)
  const signature = CryptoJS.enc.Base64.stringify(sign)
  const Authorization = "UCloud" + " " + publicKey + ":" + signature;
  return Authorization;
}

function traverse(dir: string, callback: Function) {
  fs.readdirSync(dir).forEach((file) => {
    var pathname = path.join(dir, file)
    if (fs.statSync(pathname).isDirectory()) {
      traverse(pathname, callback)
    } else {
      callback(pathname)
    }
  })
}

function run() {
  traverse(distPath, (filePath: string) => {
    if (['.html', '.map'].includes(path.extname(filePath))) return;
    upload(filePath);
  })
  // upload(filePath);
}

run();
