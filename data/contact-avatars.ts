const avatarByName: Record<string, string> = {
  "裘芨": "/avatar/資料卡_裘芨.webp",
  "渚瀾": "/avatar/資料卡_渚瀾.webp",
  "鶕綾": "/avatar/資料卡_鶕綾.webp",
  "賀止損": "/avatar/資料卡_賀止損.webp",
  "花楀": "/avatar/資料卡_花楀.webp",
  "松聽簷": "/avatar/資料卡_松聽簷.webp",
  "婪煙": "/avatar/資料卡_婪煙.webp",
  "褚日央": "/avatar/資料卡_褚日央.webp",
  "冥濠": "/avatar/資料卡_冥濠.webp",
  "玳敕青": "/avatar/資料卡_玳敕青.webp",
  "嵐": "/avatar/資料卡_嵐.webp",
};

export function getContactAvatar(label: string, formalName?: string) {
  if (formalName && avatarByName[formalName]) return avatarByName[formalName];
  const matchedName = Object.keys(avatarByName).find(name => label.includes(name));
  return matchedName ? avatarByName[matchedName] : null;
}
