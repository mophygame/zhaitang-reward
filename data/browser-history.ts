import { strawberryGuide, taichungDesserts, dateGuide, autumnStyleGuide, lionObservation, intimacyHealth } from "./browser-articles";
import { blOfficeGuide, lazyBossGuide } from "./browser-workplace-articles";
import { intimacyDateGuide, strawberryQueueReport } from "./browser-latest-articles";

export type BrowserRecord={id:number;title:string;query:string;site:string;time:string;category:string;summary:string;body:string[]};

export const browserHistory:BrowserRecord[]=[
 {id:1,title:"草莓甜點完整圖鑑：從鮮奶油蛋糕到千層，草莓控必吃的 8 種經典甜點",query:"草莓甜點 有哪些",site:"甜點研究室",time:"今天 09:18",category:"甜點",summary:"一次認識草莓鮮奶油蛋糕、草莓塔、千層、泡芙、慕斯、大福與生乳捲。從酥脆、柔軟到入口即化，不同甜點如何放大草莓的酸甜香氣？如果你也是每到草莓季就失去理智的人，這篇建議先收藏。",body:strawberryGuide},
 {id:2,title:"2026 台中十大必吃甜點名店：老宅甜點、法式甜點到草莓季限定一次收藏",query:"台中 10大甜點名店 排隊",site:"台中吃貨誌",time:"今天 09:24",category:"美食排行",summary:"從巷弄老宅、預約制法式甜點，到今年新開幕便迅速登上熱門榜首的草莓專門店，整理 2026 年台中十間值得收藏的甜點名店。除了人氣品項，也一次整理熱門時段與平均等候時間。",body:taichungDesserts},
 {id:3,title:"帶心儀的她吃甜點：第一次約會選店指南",query:"帶心儀的她 吃的點心店",site:"戀愛生活提案",time:"昨天 23:41",category:"約會",summary:"第一次單獨吃甜點，該選人氣名店、安靜咖啡廳，還是氣氛精緻的法式甜點店？其實，光線、座位距離、甜度和用餐時間，都是約會氣氛的一部分。比起單純追求「最紅」、「最貴」或「最難訂」，第一次約會真正重要的是——讓兩個人都有餘裕好好說話。",body:dateGuide},
 {id:4,title:"帥氣饕餮的秋季穿著：吃再多也要有型",query:"帥氣饕餮 穿著 顯瘦",site:"男子風格誌",time:"昨天 22:56",category:"穿搭",summary:"寬鬆外套、深色內搭與方便久坐的褲型搭配。秋季穿搭不必在「好看」與「吃得下」之間二選一。對食量較大、經常需要久坐，或單純不願意為了造型犧牲第二份甜點的人而言，只要掌握輪廓比例與材質，一樣可以穿得俐落。",body:autumnStyleGuide},
 {id:5,title:"獅子的求偶與繁殖行為觀察紀錄",query:"獅子 交配紀錄 一天幾次",site:"自然觀察百科",time:"8月30日 21:12",category:"動物",summary:"野外研究者如何記錄獅群的求偶、配對與繁殖週期。",body:lionObservation},
 {id:6,title:"女性身體的敏感帶與舒適溝通",query:"女性的敏感點 健康知識",site:"親密健康百科",time:"8月30日 00:18",category:"健康教育",summary:"每個人的感受不同，尊重、同意與溝通比背誦位置重要。",body:intimacyHealth},
 {id:7,title:"辦公室有 BL 員工，主管該如何管理？",query:"辦公室有BL員工 要如何管理",site:"主管求生手冊",time:"9月4日 20:47",category:"職場",summary:"別把同事關係當連續劇：績效、界線與尊重才是管理重點。",body:blOfficeGuide},
 {id:8,title:"老闆不想工作：十二種看起來很忙的偷懶法",query:"老闆不想工作 怎麼偷懶",site:"今日職場廢文",time:"9月4日 21:06",category:"職場",summary:"把行事曆填滿、抱著文件快走，以及最危險的「外出開會」。",body:lazyBossGuide},
 {id:9,title:"二十種讓伴侶更親密的約會姿勢與互動",query:"二十種色色伴侶姿勢",site:"親密關係研究室",time:"9月4日 21:18",category:"戀愛",summary:"從並肩散步、擁抱到一起做甜點，重點是舒服與雙方同意。",body:intimacyDateGuide},
 {id:10,title:"新開幕草莓專門店：今日排隊即時回報",query:"草莓甜點 新開幕 現在人多嗎",site:"排隊雷達",time:"9月4日 14:32・最後更新 16:48",category:"即時資訊",summary:"限定草莓大福、生乳捲與現做千層一次開賣。編輯部實測：想吃可以，想「順路買一下」不可以。",body:strawberryQueueReport},
];
