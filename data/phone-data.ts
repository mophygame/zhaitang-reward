export type CallRecord = { id:number; name:string; formal:string; direction:"撥出"|"來電"|"未接"; time:string; duration:string; day:string };

export const staff = [
  {name:"會自己賺錢的金蟾",formal:"裘芨"},
  {name:"脫水魚",formal:"渚瀾"},
  {name:"腎不好別縱慾",formal:"鶕綾"},
  {name:"狗腿燈想升天",formal:"賀止損"},
  {name:"缺水棉花糖",formal:"花楀"},
  {name:"磨牙棒別惹",formal:"松聽簷"},
  {name:"冷氣壞掉的陰溼煙",formal:"婪煙"},
  {name:"影印機本體",formal:"褚日央"},
  {name:"會咬人的薄荷糖",formal:"冥濠"},
  {name:"臉紅小青",formal:"玳敕青"},
];

const people = [...staff, {name:"小甜糕",formal:"嵐"}];
const days = ["今天","昨天","8月30日","8月29日","8月28日","8月27日","8月26日"];
const directions: CallRecord["direction"][] = ["撥出","來電","撥出","來電","未接"];

export const calls: CallRecord[] = Array.from({length:150},(_,i)=>{
  const person = people[(i * 7 + Math.floor(i / 4)) % people.length];
  const hour = 7 + ((i * 11 + 3) % 16);
  const minute = (i * 17 + 8) % 60;
  const sec = (i * 13 + 9) % 60;
  const mins = (i * 3 + 1) % 18;
  const direction = directions[(i * 3 + Math.floor(i / 9)) % directions.length];
  return { id:i+1, name:person.formal==="嵐"?"小甜糕(嵐)":`${person.name}（${person.formal}）`, formal:person.formal, direction, day:days[Math.floor(i/22)%days.length], time:`${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`, duration:direction==="未接"?"未接聽":`${String(mins).padStart(2,"0")}:${String(sec).padStart(2,"0")}` };
});

export const voicemails = [
  {id:1,day:"今天",time:"00:36",duration:"00:24",src:"/audio/01.mp3",text:"喂……妳睡了？\n沒事。就是剛剛吃了個草莓，突然想到妳。\n……很奇怪吧？\n我以前吃什麼，都不會特別想誰。\n現在倒好。吃個甜的會想到妳，看到什麼有意思的，也想跟妳說。\n……嗯。\n好像有點麻煩了。\n算了。晚安，我的草莓糖。"},
  {id:2,day:"昨天",time:"22:18",duration:"00:19",src:"/audio/02.mp3",text:"……喂，草莓糖。\n今天有沒有想我？\n……沒有？\n騙人。\n我都聞到了。\n……嗯？妳不承認？\n算了，反正我有想妳。\n一點點而已。\n……好吧。\n是有一點多。\n所以，過來吧。\n我餓了。"},
  {id:3,day:"8月29日",time:"23:47",duration:"00:22",src:"/audio/03.mp3",text:"……妳知道我為什麼喜歡妳嗎？\n不是因為妳乖，也不是因為妳聽話。\n是明明都快撐不住了，還是會自己往前走。\n……這種味道，我很喜歡。\n所以啊，偶爾任性一點，也沒關係。\n不用什麼事情都自己撐著。\n……累了，就回來。\n我會看著妳。"},
];

export { photos } from "./generated-pictures";
