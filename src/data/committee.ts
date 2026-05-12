export interface CommitteeMember {
  name: string;
  role: string;
  dept: string;
  intro: string;
  avatar?: string;
}

export interface CommitteeYear {
  year: string;
  members: CommitteeMember[];
}

export const committeeData: CommitteeYear[] = [
  {
    year: "113",
    members: [
      { name: "黃旭麟", role: "社長", dept: "四營建三", intro: "致力於推動社團數位化與傳承。", avatar: "" },
      { name: "王小明", role: "副社長", dept: "四機械三", intro: "負責技術傳承與活動安全。", avatar: "" },
      { name: "李小華", role: "器材長", dept: "四電子三", intro: "管理社團各式攀登裝備。", avatar: "" },
    ]
  },
  {
    year: "112",
    members: [
      { name: "廖英閎", role: "社長", dept: "四電機二", intro: "開拓多條百岳新路線。", avatar: "" },
      { name: "張三", role: "副社長", dept: "四資工二", intro: "熱愛高山攝影與紀錄。", avatar: "" },
    ]
  },
  {
    year: "111",
    members: [
      { name: "謝昀容", role: "社長", dept: "四設計二", intro: "強化社團美學與視覺呈現。", avatar: "" },
    ]
  },
  {
    year: "110",
    members: [
      { name: "劉晴華", role: "社長", dept: "四電子四", intro: "重啟受疫情影響的實體活動。", avatar: "" },
    ]
  },
  {
    year: "107",
    members: [
      { name: "陳慶瑩", role: "社長", dept: "四化工四", intro: "建立完善的社產管理制度。", avatar: "" },
    ]
  },
  {
    year: "106",
    members: [
      { name: "唐平安", role: "社長", dept: "四機械三", intro: "帶領社員參與多項救務訓練。", avatar: "" },
    ]
  },
  {
    year: "104(下)-105(下)",
    members: [
      { name: "高靖捷", role: "社長", dept: "四建築四", intro: "舊版 Jimdo 官網設計者與攝影師。", avatar: "" },
    ]
  },
  // ... 其他年份可以簡化只放社長
  { year: "103-104(下)", members: [{ name: "沈桓毅", role: "社長", dept: "四化工二", intro: "", avatar: "" }] },
  { year: "102(下)", members: [{ name: "吳紀儒", role: "社長", dept: "機械碩一", intro: "", avatar: "" }] },
  { year: "102(上)", members: [{ name: "林佳龍", role: "社長", dept: "四機械三", intro: "", avatar: "" }] },
  { year: "100-101", members: [{ name: "王逸軒", role: "社長", dept: "四資管三", intro: "", avatar: "" }] },
  { year: "99", members: [{ name: "謝承恩", role: "社長", dept: "四設計四", intro: "", avatar: "" }] },
  { year: "98", members: [{ name: "汪書廷", role: "社長", dept: "四電資三", intro: "", avatar: "" }] },
  { year: "97", members: [{ name: "廖濱", role: "社長", dept: "二資工三", intro: "", avatar: "" }] },
  { year: "96", members: [{ name: "姚家瑋", role: "社長", dept: "四資工二", intro: "", avatar: "" }] },
  { year: "95", members: [{ name: "蘇育隆", role: "社長", dept: "四企管三", intro: "", avatar: "" }] },
  { year: "94", members: [{ name: "陳明毅", role: "社長", dept: "四營建二", intro: "", avatar: "" }] },
  { year: "93(下)", members: [{ name: "辜建嘉", role: "社長", dept: "四化工三", intro: "", avatar: "" }] },
  { year: "93(上)", members: [{ name: "林育欣", role: "社長", dept: "四化工三", intro: "", avatar: "" }] },
  { year: "91-92", members: [{ name: "陳佳駿", role: "社長", dept: "四電機三", intro: "", avatar: "" }] },
  { year: "90", members: [{ name: "馬漢裕", role: "社長", dept: "四電子三", intro: "", avatar: "" }] },
  { year: "89", members: [{ name: "朱信炎", role: "社長", dept: "四營建三", intro: "", avatar: "" }] },
  { year: "88", members: [{ name: "黃建雙", role: "社長", dept: "四資三", intro: "", avatar: "" }] },
  { year: "87", members: [{ name: "黃峰栓", role: "社長", dept: "四纖三", intro: "", avatar: "" }] },
  { year: "86", members: [{ name: "林裕強", role: "社長", dept: "四資三", intro: "", avatar: "" }] },
  { year: "85", members: [{ name: "胡茂龍", role: "社長", dept: "四電子三", intro: "", avatar: "" }] },
  { year: "84", members: [{ name: "胡茂龍", role: "社長", dept: "四資三", intro: "", avatar: "" }] },
  { year: "83", members: [{ name: "李德良", role: "社長", dept: "四電子三", intro: "", avatar: "" }] },
  { year: "82", members: [{ name: "洪賢首", role: "社長", dept: "四纖三", intro: "", avatar: "" }] },
  { year: "81", members: [{ name: "曾俊龍", role: "社長", dept: "四機三", intro: "", avatar: "" }] },
  { year: "80", members: [{ name: "李進安", role: "社長", dept: "四化三", intro: "", avatar: "" }] },
  { year: "79", members: [{ name: "陳平桂", role: "社長", dept: "不詳", intro: "", avatar: "" }] },
  { year: "77", members: [{ name: "徐仁熾", role: "社長", dept: "不詳", intro: "", avatar: "" }] },
  { year: "76", members: [{ name: "孟遠謀", role: "社長", dept: "不詳", intro: "", avatar: "" }] },
  { year: "75", members: [{ name: "劉憲政", role: "社長", dept: "不詳", intro: "", avatar: "" }] },
  { year: "72", members: [{ name: "吳龍井", role: "社長", dept: "不詳", intro: "", avatar: "" }] },
  { year: "71", members: [{ name: "王正龍", role: "社長", dept: "不詳", intro: "", avatar: "" }] },
  { year: "68", members: [{ name: "王瑞斌", role: "社長", dept: "不詳", intro: "台科大登山社創社社長。", avatar: "" }] },
];
