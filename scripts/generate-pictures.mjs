import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const projectRoot=process.cwd();
const candidates=["picuture","picture"];
let publicFolder="";
for(const candidate of candidates){
  try{if((await stat(path.join(projectRoot,"public",candidate))).isDirectory()){publicFolder=candidate;break}}catch{}
}
if(!publicFolder)throw new Error("找不到 public/picuture 或 public/picture 資料夾");

const supported=new Set([".jpg",".jpeg",".png",".webp",".gif",".avif"]);
const sourceDir=path.join(projectRoot,"public",publicFolder);
const names=(await readdir(sourceDir)).filter(name=>supported.has(path.extname(name).toLowerCase())).sort((a,b)=>a.localeCompare(b,"zh-Hant",{numeric:true}));
const formatter=new Intl.DateTimeFormat("zh-TW",{timeZone:"Asia/Taipei",month:"long",day:"numeric",hour:"2-digit",minute:"2-digit",hour12:false});
const photos=await Promise.all(names.map(async(name,index)=>{
  const info=await stat(path.join(sourceDir,name));
  return{id:index+1,title:path.basename(name,path.extname(name)),date:formatter.format(info.mtime),modifiedAt:info.mtime.toISOString(),src:`/${publicFolder}/${encodeURIComponent(name)}`};
}));
const output=`// 此檔案由 npm run pic 自動產生，請勿手動修改。\nexport const photos = ${JSON.stringify(photos,null,2)} as const;\n`;
await writeFile(path.join(projectRoot,"data","generated-pictures.ts"),output,"utf8");
console.log(`已從 public/${publicFolder} 更新 ${photos.length} 張相簿圖片。`);
