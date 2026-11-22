export interface WorkbookKanjiEntry {
  char: string;
  level: "N5" | "N4" | "N3";
  word: string;
  reading: string;
  meaning: string;
}

export interface WorkbookDay {
  day: number;
  range: string;
  kanji: WorkbookKanjiEntry[];
}

export const KANJI_WORKBOOK_DAYS: WorkbookDay[] = [
  {
    "day": 1,
    "range": "001-016",
    "kanji": [
      {
        "char": "人",
        "level": "N5",
        "word": "人",
        "reading": "ひと",
        "meaning": "person"
      },
      {
        "char": "一",
        "level": "N5",
        "word": "一つ",
        "reading": "ひとつ",
        "meaning": "one item"
      },
      {
        "char": "日",
        "level": "N5",
        "word": "日本",
        "reading": "にほん",
        "meaning": "Japan"
      },
      {
        "char": "大",
        "level": "N5",
        "word": "大きい",
        "reading": "おおきい",
        "meaning": "big"
      },
      {
        "char": "年",
        "level": "N5",
        "word": "今年",
        "reading": "ことし",
        "meaning": "this year"
      },
      {
        "char": "出",
        "level": "N5",
        "word": "出る",
        "reading": "でる",
        "meaning": "go out"
      },
      {
        "char": "本",
        "level": "N5",
        "word": "本",
        "reading": "ほん",
        "meaning": "book"
      },
      {
        "char": "中",
        "level": "N5",
        "word": "中",
        "reading": "なか",
        "meaning": "inside"
      },
      {
        "char": "子",
        "level": "N5",
        "word": "子ども",
        "reading": "こども",
        "meaning": "child"
      },
      {
        "char": "見",
        "level": "N5",
        "word": "見る",
        "reading": "みる",
        "meaning": "see"
      },
      {
        "char": "国",
        "level": "N5",
        "word": "国",
        "reading": "くに",
        "meaning": "country"
      },
      {
        "char": "上",
        "level": "N5",
        "word": "上",
        "reading": "うえ",
        "meaning": "above"
      },
      {
        "char": "分",
        "level": "N5",
        "word": "五分",
        "reading": "ごふん",
        "meaning": "five minutes"
      },
      {
        "char": "生",
        "level": "N5",
        "word": "学生",
        "reading": "がくせい",
        "meaning": "student"
      },
      {
        "char": "行",
        "level": "N5",
        "word": "行く",
        "reading": "いく",
        "meaning": "go"
      },
      {
        "char": "二",
        "level": "N5",
        "word": "二つ",
        "reading": "ふたつ",
        "meaning": "two items"
      }
    ]
  },
  {
    "day": 2,
    "range": "017-032",
    "kanji": [
      {
        "char": "間",
        "level": "N5",
        "word": "時間",
        "reading": "じかん",
        "meaning": "time"
      },
      {
        "char": "時",
        "level": "N5",
        "word": "四時",
        "reading": "よじ",
        "meaning": "four o'clock"
      },
      {
        "char": "気",
        "level": "N5",
        "word": "元気",
        "reading": "げんき",
        "meaning": "healthy and energetic"
      },
      {
        "char": "十",
        "level": "N5",
        "word": "十",
        "reading": "じゅう",
        "meaning": "ten"
      },
      {
        "char": "女",
        "level": "N5",
        "word": "女の人",
        "reading": "おんなのひと",
        "meaning": "woman"
      },
      {
        "char": "三",
        "level": "N5",
        "word": "三つ",
        "reading": "みっつ",
        "meaning": "three items"
      },
      {
        "char": "前",
        "level": "N5",
        "word": "前",
        "reading": "まえ",
        "meaning": "before or in front"
      },
      {
        "char": "入",
        "level": "N5",
        "word": "入る",
        "reading": "はいる",
        "meaning": "enter"
      },
      {
        "char": "小",
        "level": "N5",
        "word": "小さい",
        "reading": "ちいさい",
        "meaning": "small"
      },
      {
        "char": "後",
        "level": "N5",
        "word": "後で",
        "reading": "あとで",
        "meaning": "later"
      },
      {
        "char": "長",
        "level": "N5",
        "word": "長い",
        "reading": "ながい",
        "meaning": "long"
      },
      {
        "char": "下",
        "level": "N5",
        "word": "下",
        "reading": "した",
        "meaning": "below"
      },
      {
        "char": "学",
        "level": "N5",
        "word": "学校",
        "reading": "がっこう",
        "meaning": "school"
      },
      {
        "char": "月",
        "level": "N5",
        "word": "月曜日",
        "reading": "げつようび",
        "meaning": "Monday"
      },
      {
        "char": "何",
        "level": "N5",
        "word": "何",
        "reading": "なに",
        "meaning": "what"
      },
      {
        "char": "来",
        "level": "N5",
        "word": "来る",
        "reading": "くる",
        "meaning": "come"
      }
    ]
  },
  {
    "day": 3,
    "range": "033-048",
    "kanji": [
      {
        "char": "話",
        "level": "N5",
        "word": "話す",
        "reading": "はなす",
        "meaning": "speak"
      },
      {
        "char": "山",
        "level": "N5",
        "word": "山",
        "reading": "やま",
        "meaning": "mountain"
      },
      {
        "char": "高",
        "level": "N5",
        "word": "高い",
        "reading": "たかい",
        "meaning": "high or expensive"
      },
      {
        "char": "今",
        "level": "N5",
        "word": "今",
        "reading": "いま",
        "meaning": "now"
      },
      {
        "char": "書",
        "level": "N5",
        "word": "書く",
        "reading": "かく",
        "meaning": "write"
      },
      {
        "char": "五",
        "level": "N5",
        "word": "五つ",
        "reading": "いつつ",
        "meaning": "five items"
      },
      {
        "char": "名",
        "level": "N5",
        "word": "名前",
        "reading": "なまえ",
        "meaning": "name"
      },
      {
        "char": "金",
        "level": "N5",
        "word": "お金",
        "reading": "おかね",
        "meaning": "money"
      },
      {
        "char": "男",
        "level": "N5",
        "word": "男の人",
        "reading": "おとこのひと",
        "meaning": "man"
      },
      {
        "char": "外",
        "level": "N5",
        "word": "外",
        "reading": "そと",
        "meaning": "outside"
      },
      {
        "char": "四",
        "level": "N5",
        "word": "四つ",
        "reading": "よっつ",
        "meaning": "four items"
      },
      {
        "char": "先",
        "level": "N5",
        "word": "先生",
        "reading": "せんせい",
        "meaning": "teacher"
      },
      {
        "char": "川",
        "level": "N5",
        "word": "川",
        "reading": "かわ",
        "meaning": "river"
      },
      {
        "char": "東",
        "level": "N5",
        "word": "東",
        "reading": "ひがし",
        "meaning": "east"
      },
      {
        "char": "聞",
        "level": "N5",
        "word": "聞く",
        "reading": "きく",
        "meaning": "hear or ask"
      },
      {
        "char": "語",
        "level": "N5",
        "word": "日本語",
        "reading": "にほんご",
        "meaning": "Japanese language"
      }
    ]
  },
  {
    "day": 4,
    "range": "049-064",
    "kanji": [
      {
        "char": "九",
        "level": "N5",
        "word": "九つ",
        "reading": "ここのつ",
        "meaning": "nine items"
      },
      {
        "char": "食",
        "level": "N5",
        "word": "食べる",
        "reading": "たべる",
        "meaning": "eat"
      },
      {
        "char": "八",
        "level": "N5",
        "word": "八つ",
        "reading": "やっつ",
        "meaning": "eight items"
      },
      {
        "char": "水",
        "level": "N5",
        "word": "水",
        "reading": "みず",
        "meaning": "water"
      },
      {
        "char": "天",
        "level": "N5",
        "word": "天気",
        "reading": "てんき",
        "meaning": "weather"
      },
      {
        "char": "木",
        "level": "N5",
        "word": "木",
        "reading": "き",
        "meaning": "tree"
      },
      {
        "char": "六",
        "level": "N5",
        "word": "六つ",
        "reading": "むっつ",
        "meaning": "six items"
      },
      {
        "char": "万",
        "level": "N5",
        "word": "一万",
        "reading": "いちまん",
        "meaning": "ten thousand"
      },
      {
        "char": "白",
        "level": "N5",
        "word": "白い",
        "reading": "しろい",
        "meaning": "white"
      },
      {
        "char": "七",
        "level": "N5",
        "word": "七つ",
        "reading": "ななつ",
        "meaning": "seven items"
      },
      {
        "char": "円",
        "level": "N5",
        "word": "百円",
        "reading": "ひゃくえん",
        "meaning": "one hundred yen"
      },
      {
        "char": "電",
        "level": "N5",
        "word": "電車",
        "reading": "でんしゃ",
        "meaning": "train"
      },
      {
        "char": "父",
        "level": "N5",
        "word": "父",
        "reading": "ちち",
        "meaning": "my father"
      },
      {
        "char": "北",
        "level": "N5",
        "word": "北",
        "reading": "きた",
        "meaning": "north"
      },
      {
        "char": "車",
        "level": "N5",
        "word": "車",
        "reading": "くるま",
        "meaning": "car"
      },
      {
        "char": "母",
        "level": "N5",
        "word": "母",
        "reading": "はは",
        "meaning": "my mother"
      }
    ]
  },
  {
    "day": 5,
    "range": "065-080",
    "kanji": [
      {
        "char": "半",
        "level": "N5",
        "word": "半分",
        "reading": "はんぶん",
        "meaning": "half"
      },
      {
        "char": "百",
        "level": "N5",
        "word": "百",
        "reading": "ひゃく",
        "meaning": "one hundred"
      },
      {
        "char": "土",
        "level": "N5",
        "word": "土曜日",
        "reading": "どようび",
        "meaning": "Saturday"
      },
      {
        "char": "西",
        "level": "N5",
        "word": "西",
        "reading": "にし",
        "meaning": "west"
      },
      {
        "char": "読",
        "level": "N5",
        "word": "読む",
        "reading": "よむ",
        "meaning": "read"
      },
      {
        "char": "千",
        "level": "N5",
        "word": "千",
        "reading": "せん",
        "meaning": "one thousand"
      },
      {
        "char": "校",
        "level": "N5",
        "word": "高校",
        "reading": "こうこう",
        "meaning": "high school"
      },
      {
        "char": "右",
        "level": "N5",
        "word": "右",
        "reading": "みぎ",
        "meaning": "right"
      },
      {
        "char": "南",
        "level": "N5",
        "word": "南",
        "reading": "みなみ",
        "meaning": "south"
      },
      {
        "char": "左",
        "level": "N5",
        "word": "左",
        "reading": "ひだり",
        "meaning": "left"
      },
      {
        "char": "友",
        "level": "N5",
        "word": "友達",
        "reading": "ともだち",
        "meaning": "friend"
      },
      {
        "char": "火",
        "level": "N5",
        "word": "火",
        "reading": "ひ",
        "meaning": "fire"
      },
      {
        "char": "毎",
        "level": "N5",
        "word": "毎日",
        "reading": "まいにち",
        "meaning": "every day"
      },
      {
        "char": "雨",
        "level": "N5",
        "word": "雨",
        "reading": "あめ",
        "meaning": "rain"
      },
      {
        "char": "休",
        "level": "N5",
        "word": "休む",
        "reading": "やすむ",
        "meaning": "rest or be absent"
      },
      {
        "char": "午",
        "level": "N5",
        "word": "午後",
        "reading": "ごご",
        "meaning": "afternoon"
      }
    ]
  },
  {
    "day": 6,
    "range": "081-101",
    "kanji": [
      {
        "char": "言",
        "level": "N4",
        "word": "言う",
        "reading": "いう",
        "meaning": "say"
      },
      {
        "char": "手",
        "level": "N4",
        "word": "手",
        "reading": "て",
        "meaning": "hand"
      },
      {
        "char": "自",
        "level": "N4",
        "word": "自分",
        "reading": "じぶん",
        "meaning": "oneself"
      },
      {
        "char": "者",
        "level": "N4",
        "word": "医者",
        "reading": "いしゃ",
        "meaning": "doctor"
      },
      {
        "char": "事",
        "level": "N4",
        "word": "仕事",
        "reading": "しごと",
        "meaning": "work"
      },
      {
        "char": "思",
        "level": "N4",
        "word": "思う",
        "reading": "おもう",
        "meaning": "think"
      },
      {
        "char": "会",
        "level": "N4",
        "word": "会社",
        "reading": "かいしゃ",
        "meaning": "company"
      },
      {
        "char": "家",
        "level": "N4",
        "word": "家",
        "reading": "いえ",
        "meaning": "house"
      },
      {
        "char": "的",
        "level": "N4",
        "word": "目的",
        "reading": "もくてき",
        "meaning": "purpose"
      },
      {
        "char": "方",
        "level": "N4",
        "word": "使い方",
        "reading": "つかいかた",
        "meaning": "how to use"
      },
      {
        "char": "地",
        "level": "N4",
        "word": "地図",
        "reading": "ちず",
        "meaning": "map"
      },
      {
        "char": "目",
        "level": "N4",
        "word": "目",
        "reading": "め",
        "meaning": "eye"
      },
      {
        "char": "場",
        "level": "N4",
        "word": "場所",
        "reading": "ばしょ",
        "meaning": "place"
      },
      {
        "char": "代",
        "level": "N4",
        "word": "時代",
        "reading": "じだい",
        "meaning": "era"
      },
      {
        "char": "私",
        "level": "N4",
        "word": "私",
        "reading": "わたし",
        "meaning": "I"
      },
      {
        "char": "立",
        "level": "N4",
        "word": "立つ",
        "reading": "たつ",
        "meaning": "stand"
      },
      {
        "char": "物",
        "level": "N4",
        "word": "買い物",
        "reading": "かいもの",
        "meaning": "shopping"
      },
      {
        "char": "田",
        "level": "N4",
        "word": "田んぼ",
        "reading": "たんぼ",
        "meaning": "rice field"
      },
      {
        "char": "体",
        "level": "N4",
        "word": "体",
        "reading": "からだ",
        "meaning": "body"
      },
      {
        "char": "動",
        "level": "N4",
        "word": "動く",
        "reading": "うごく",
        "meaning": "move"
      },
      {
        "char": "社",
        "level": "N4",
        "word": "社会",
        "reading": "しゃかい",
        "meaning": "society"
      }
    ]
  },
  {
    "day": 7,
    "range": "102-122",
    "kanji": [
      {
        "char": "知",
        "level": "N4",
        "word": "知る",
        "reading": "しる",
        "meaning": "get to know"
      },
      {
        "char": "理",
        "level": "N4",
        "word": "理由",
        "reading": "りゆう",
        "meaning": "reason"
      },
      {
        "char": "同",
        "level": "N4",
        "word": "同じ",
        "reading": "おなじ",
        "meaning": "same"
      },
      {
        "char": "心",
        "level": "N4",
        "word": "心",
        "reading": "こころ",
        "meaning": "heart or mind"
      },
      {
        "char": "発",
        "level": "N4",
        "word": "出発",
        "reading": "しゅっぱつ",
        "meaning": "departure"
      },
      {
        "char": "作",
        "level": "N4",
        "word": "作る",
        "reading": "つくる",
        "meaning": "make"
      },
      {
        "char": "新",
        "level": "N4",
        "word": "新しい",
        "reading": "あたらしい",
        "meaning": "new"
      },
      {
        "char": "世",
        "level": "N4",
        "word": "世界",
        "reading": "せかい",
        "meaning": "world"
      },
      {
        "char": "度",
        "level": "N4",
        "word": "今度",
        "reading": "こんど",
        "meaning": "this time or next time"
      },
      {
        "char": "明",
        "level": "N4",
        "word": "明るい",
        "reading": "あかるい",
        "meaning": "bright"
      },
      {
        "char": "力",
        "level": "N4",
        "word": "力",
        "reading": "ちから",
        "meaning": "strength"
      },
      {
        "char": "意",
        "level": "N4",
        "word": "意味",
        "reading": "いみ",
        "meaning": "meaning"
      },
      {
        "char": "用",
        "level": "N4",
        "word": "用事",
        "reading": "ようじ",
        "meaning": "errand or business"
      },
      {
        "char": "主",
        "level": "N4",
        "word": "主人",
        "reading": "しゅじん",
        "meaning": "husband or master"
      },
      {
        "char": "通",
        "level": "N4",
        "word": "通る",
        "reading": "とおる",
        "meaning": "pass through"
      },
      {
        "char": "文",
        "level": "N4",
        "word": "作文",
        "reading": "さくぶん",
        "meaning": "composition"
      },
      {
        "char": "屋",
        "level": "N4",
        "word": "部屋",
        "reading": "へや",
        "meaning": "room"
      },
      {
        "char": "業",
        "level": "N4",
        "word": "授業",
        "reading": "じゅぎょう",
        "meaning": "class lesson"
      },
      {
        "char": "持",
        "level": "N4",
        "word": "持つ",
        "reading": "もつ",
        "meaning": "hold or carry"
      },
      {
        "char": "道",
        "level": "N4",
        "word": "道",
        "reading": "みち",
        "meaning": "road"
      },
      {
        "char": "身",
        "level": "N4",
        "word": "身長",
        "reading": "しんちょう",
        "meaning": "height of a person"
      }
    ]
  },
  {
    "day": 8,
    "range": "123-143",
    "kanji": [
      {
        "char": "不",
        "level": "N4",
        "word": "不便",
        "reading": "ふべん",
        "meaning": "inconvenient"
      },
      {
        "char": "口",
        "level": "N4",
        "word": "口",
        "reading": "くち",
        "meaning": "mouth"
      },
      {
        "char": "多",
        "level": "N4",
        "word": "多い",
        "reading": "おおい",
        "meaning": "many"
      },
      {
        "char": "野",
        "level": "N4",
        "word": "野菜",
        "reading": "やさい",
        "meaning": "vegetables"
      },
      {
        "char": "考",
        "level": "N4",
        "word": "考える",
        "reading": "かんがえる",
        "meaning": "consider"
      },
      {
        "char": "開",
        "level": "N4",
        "word": "開ける",
        "reading": "あける",
        "meaning": "open something"
      },
      {
        "char": "教",
        "level": "N4",
        "word": "教える",
        "reading": "おしえる",
        "meaning": "teach"
      },
      {
        "char": "近",
        "level": "N4",
        "word": "近い",
        "reading": "ちかい",
        "meaning": "near"
      },
      {
        "char": "以",
        "level": "N4",
        "word": "以上",
        "reading": "いじょう",
        "meaning": "at least or more than the stated amount"
      },
      {
        "char": "問",
        "level": "N4",
        "word": "質問",
        "reading": "しつもん",
        "meaning": "question"
      },
      {
        "char": "正",
        "level": "N4",
        "word": "正しい",
        "reading": "ただしい",
        "meaning": "correct"
      },
      {
        "char": "真",
        "level": "N4",
        "word": "写真",
        "reading": "しゃしん",
        "meaning": "photograph"
      },
      {
        "char": "味",
        "level": "N4",
        "word": "味",
        "reading": "あじ",
        "meaning": "taste"
      },
      {
        "char": "界",
        "level": "N4",
        "word": "業界",
        "reading": "ぎょうかい",
        "meaning": "industry sector"
      },
      {
        "char": "無",
        "level": "N4",
        "word": "無理",
        "reading": "むり",
        "meaning": "unreasonable or impossible"
      },
      {
        "char": "少",
        "level": "N4",
        "word": "少ない",
        "reading": "すくない",
        "meaning": "few"
      },
      {
        "char": "海",
        "level": "N4",
        "word": "海",
        "reading": "うみ",
        "meaning": "sea"
      },
      {
        "char": "切",
        "level": "N4",
        "word": "切る",
        "reading": "きる",
        "meaning": "cut"
      },
      {
        "char": "重",
        "level": "N4",
        "word": "重い",
        "reading": "おもい",
        "meaning": "heavy"
      },
      {
        "char": "集",
        "level": "N4",
        "word": "集まる",
        "reading": "あつまる",
        "meaning": "gather"
      },
      {
        "char": "員",
        "level": "N4",
        "word": "店員",
        "reading": "てんいん",
        "meaning": "shop assistant"
      }
    ]
  },
  {
    "day": 9,
    "range": "144-165",
    "kanji": [
      {
        "char": "公",
        "level": "N4",
        "word": "公園",
        "reading": "こうえん",
        "meaning": "park"
      },
      {
        "char": "画",
        "level": "N4",
        "word": "映画",
        "reading": "えいが",
        "meaning": "film"
      },
      {
        "char": "死",
        "level": "N4",
        "word": "死ぬ",
        "reading": "しぬ",
        "meaning": "die"
      },
      {
        "char": "安",
        "level": "N4",
        "word": "安い",
        "reading": "やすい",
        "meaning": "inexpensive"
      },
      {
        "char": "親",
        "level": "N4",
        "word": "親",
        "reading": "おや",
        "meaning": "parent"
      },
      {
        "char": "強",
        "level": "N4",
        "word": "強い",
        "reading": "つよい",
        "meaning": "strong"
      },
      {
        "char": "使",
        "level": "N4",
        "word": "使う",
        "reading": "つかう",
        "meaning": "use"
      },
      {
        "char": "朝",
        "level": "N4",
        "word": "朝",
        "reading": "あさ",
        "meaning": "morning"
      },
      {
        "char": "題",
        "level": "N4",
        "word": "宿題",
        "reading": "しゅくだい",
        "meaning": "homework"
      },
      {
        "char": "仕",
        "level": "N4",
        "word": "仕方",
        "reading": "しかた",
        "meaning": "way or method"
      },
      {
        "char": "京",
        "level": "N4",
        "word": "東京",
        "reading": "とうきょう",
        "meaning": "Tokyo"
      },
      {
        "char": "足",
        "level": "N4",
        "word": "足",
        "reading": "あし",
        "meaning": "foot or leg"
      },
      {
        "char": "品",
        "level": "N4",
        "word": "品物",
        "reading": "しなもの",
        "meaning": "goods"
      },
      {
        "char": "着",
        "level": "N4",
        "word": "着る",
        "reading": "きる",
        "meaning": "wear on the upper body"
      },
      {
        "char": "別",
        "level": "N4",
        "word": "別々",
        "reading": "べつべつ",
        "meaning": "separate"
      },
      {
        "char": "音",
        "level": "N4",
        "word": "音",
        "reading": "おと",
        "meaning": "sound"
      },
      {
        "char": "元",
        "level": "N4",
        "word": "元日",
        "reading": "がんじつ",
        "meaning": "New Year's Day"
      },
      {
        "char": "特",
        "level": "N4",
        "word": "特別",
        "reading": "とくべつ",
        "meaning": "special"
      },
      {
        "char": "風",
        "level": "N4",
        "word": "風",
        "reading": "かぜ",
        "meaning": "wind"
      },
      {
        "char": "夜",
        "level": "N4",
        "word": "夜",
        "reading": "よる",
        "meaning": "night"
      },
      {
        "char": "空",
        "level": "N4",
        "word": "空",
        "reading": "そら",
        "meaning": "sky"
      },
      {
        "char": "有",
        "level": "N4",
        "word": "有名",
        "reading": "ゆうめい",
        "meaning": "famous"
      }
    ]
  },
  {
    "day": 10,
    "range": "166-186",
    "kanji": [
      {
        "char": "起",
        "level": "N4",
        "word": "起きる",
        "reading": "おきる",
        "meaning": "get up"
      },
      {
        "char": "運",
        "level": "N4",
        "word": "運転",
        "reading": "うんてん",
        "meaning": "driving"
      },
      {
        "char": "料",
        "level": "N4",
        "word": "料理",
        "reading": "りょうり",
        "meaning": "cooking or cuisine"
      },
      {
        "char": "楽",
        "level": "N4",
        "word": "楽しい",
        "reading": "たのしい",
        "meaning": "enjoyable"
      },
      {
        "char": "色",
        "level": "N4",
        "word": "色",
        "reading": "いろ",
        "meaning": "colour"
      },
      {
        "char": "帰",
        "level": "N4",
        "word": "帰る",
        "reading": "かえる",
        "meaning": "return home"
      },
      {
        "char": "歩",
        "level": "N4",
        "word": "歩く",
        "reading": "あるく",
        "meaning": "walk"
      },
      {
        "char": "悪",
        "level": "N4",
        "word": "悪い",
        "reading": "わるい",
        "meaning": "bad"
      },
      {
        "char": "広",
        "level": "N4",
        "word": "広い",
        "reading": "ひろい",
        "meaning": "spacious"
      },
      {
        "char": "店",
        "level": "N4",
        "word": "店",
        "reading": "みせ",
        "meaning": "shop"
      },
      {
        "char": "町",
        "level": "N4",
        "word": "町",
        "reading": "まち",
        "meaning": "town"
      },
      {
        "char": "住",
        "level": "N4",
        "word": "住む",
        "reading": "すむ",
        "meaning": "live or reside"
      },
      {
        "char": "売",
        "level": "N4",
        "word": "売る",
        "reading": "うる",
        "meaning": "sell"
      },
      {
        "char": "待",
        "level": "N4",
        "word": "待つ",
        "reading": "まつ",
        "meaning": "wait"
      },
      {
        "char": "古",
        "level": "N4",
        "word": "古い",
        "reading": "ふるい",
        "meaning": "old"
      },
      {
        "char": "始",
        "level": "N4",
        "word": "始まる",
        "reading": "はじまる",
        "meaning": "begin"
      },
      {
        "char": "終",
        "level": "N4",
        "word": "終わる",
        "reading": "おわる",
        "meaning": "finish"
      },
      {
        "char": "計",
        "level": "N4",
        "word": "時計",
        "reading": "とけい",
        "meaning": "clock or watch"
      },
      {
        "char": "院",
        "level": "N4",
        "word": "病院",
        "reading": "びょういん",
        "meaning": "hospital"
      },
      {
        "char": "送",
        "level": "N4",
        "word": "送る",
        "reading": "おくる",
        "meaning": "send"
      },
      {
        "char": "族",
        "level": "N4",
        "word": "家族",
        "reading": "かぞく",
        "meaning": "family"
      }
    ]
  },
  {
    "day": 11,
    "range": "187-207",
    "kanji": [
      {
        "char": "映",
        "level": "N4",
        "word": "映る",
        "reading": "うつる",
        "meaning": "appear on a screen or be reflected"
      },
      {
        "char": "買",
        "level": "N4",
        "word": "買う",
        "reading": "かう",
        "meaning": "buy"
      },
      {
        "char": "病",
        "level": "N4",
        "word": "病気",
        "reading": "びょうき",
        "meaning": "illness"
      },
      {
        "char": "早",
        "level": "N4",
        "word": "早い",
        "reading": "はやい",
        "meaning": "early"
      },
      {
        "char": "質",
        "level": "N4",
        "word": "品質",
        "reading": "ひんしつ",
        "meaning": "quality"
      },
      {
        "char": "台",
        "level": "N4",
        "word": "台所",
        "reading": "だいどころ",
        "meaning": "kitchen"
      },
      {
        "char": "室",
        "level": "N4",
        "word": "教室",
        "reading": "きょうしつ",
        "meaning": "classroom"
      },
      {
        "char": "可",
        "level": "N4",
        "word": "可能",
        "reading": "かのう",
        "meaning": "possible"
      },
      {
        "char": "建",
        "level": "N4",
        "word": "建てる",
        "reading": "たてる",
        "meaning": "build"
      },
      {
        "char": "転",
        "level": "N4",
        "word": "自転車",
        "reading": "じてんしゃ",
        "meaning": "bicycle"
      },
      {
        "char": "医",
        "level": "N4",
        "word": "医学",
        "reading": "いがく",
        "meaning": "medical science"
      },
      {
        "char": "止",
        "level": "N4",
        "word": "止まる",
        "reading": "とまる",
        "meaning": "stop"
      },
      {
        "char": "字",
        "level": "N4",
        "word": "漢字",
        "reading": "かんじ",
        "meaning": "kanji character"
      },
      {
        "char": "工",
        "level": "N4",
        "word": "工場",
        "reading": "こうじょう",
        "meaning": "factory"
      },
      {
        "char": "急",
        "level": "N4",
        "word": "急ぐ",
        "reading": "いそぐ",
        "meaning": "hurry"
      },
      {
        "char": "図",
        "level": "N4",
        "word": "図書館",
        "reading": "としょかん",
        "meaning": "library"
      },
      {
        "char": "黒",
        "level": "N4",
        "word": "黒い",
        "reading": "くろい",
        "meaning": "black"
      },
      {
        "char": "花",
        "level": "N4",
        "word": "花",
        "reading": "はな",
        "meaning": "flower"
      },
      {
        "char": "英",
        "level": "N4",
        "word": "英語",
        "reading": "えいご",
        "meaning": "English language"
      },
      {
        "char": "走",
        "level": "N4",
        "word": "走る",
        "reading": "はしる",
        "meaning": "run"
      },
      {
        "char": "青",
        "level": "N4",
        "word": "青い",
        "reading": "あおい",
        "meaning": "blue"
      }
    ]
  },
  {
    "day": 12,
    "range": "208-228",
    "kanji": [
      {
        "char": "答",
        "level": "N4",
        "word": "答える",
        "reading": "こたえる",
        "meaning": "answer"
      },
      {
        "char": "紙",
        "level": "N4",
        "word": "紙",
        "reading": "かみ",
        "meaning": "paper"
      },
      {
        "char": "歌",
        "level": "N4",
        "word": "歌う",
        "reading": "うたう",
        "meaning": "sing"
      },
      {
        "char": "注",
        "level": "N4",
        "word": "注意",
        "reading": "ちゅうい",
        "meaning": "attention or caution"
      },
      {
        "char": "赤",
        "level": "N4",
        "word": "赤い",
        "reading": "あかい",
        "meaning": "red"
      },
      {
        "char": "春",
        "level": "N4",
        "word": "春",
        "reading": "はる",
        "meaning": "spring"
      },
      {
        "char": "館",
        "level": "N4",
        "word": "旅館",
        "reading": "りょかん",
        "meaning": "Japanese inn"
      },
      {
        "char": "旅",
        "level": "N4",
        "word": "旅行",
        "reading": "りょこう",
        "meaning": "travel"
      },
      {
        "char": "験",
        "level": "N4",
        "word": "経験",
        "reading": "けいけん",
        "meaning": "experience"
      },
      {
        "char": "写",
        "level": "N4",
        "word": "写す",
        "reading": "うつす",
        "meaning": "copy or photograph"
      },
      {
        "char": "去",
        "level": "N4",
        "word": "去年",
        "reading": "きょねん",
        "meaning": "last year"
      },
      {
        "char": "研",
        "level": "N4",
        "word": "研究",
        "reading": "けんきゅう",
        "meaning": "research"
      },
      {
        "char": "飲",
        "level": "N4",
        "word": "飲む",
        "reading": "のむ",
        "meaning": "drink"
      },
      {
        "char": "肉",
        "level": "N4",
        "word": "肉",
        "reading": "にく",
        "meaning": "meat"
      },
      {
        "char": "服",
        "level": "N4",
        "word": "服",
        "reading": "ふく",
        "meaning": "clothes"
      },
      {
        "char": "銀",
        "level": "N4",
        "word": "銀行",
        "reading": "ぎんこう",
        "meaning": "bank"
      },
      {
        "char": "茶",
        "level": "N4",
        "word": "お茶",
        "reading": "おちゃ",
        "meaning": "tea"
      },
      {
        "char": "究",
        "level": "N4",
        "word": "究める",
        "reading": "きわめる",
        "meaning": "study thoroughly"
      },
      {
        "char": "洋",
        "level": "N4",
        "word": "洋服",
        "reading": "ようふく",
        "meaning": "Western style clothes"
      },
      {
        "char": "兄",
        "level": "N4",
        "word": "兄",
        "reading": "あに",
        "meaning": "my older brother"
      },
      {
        "char": "秋",
        "level": "N4",
        "word": "秋",
        "reading": "あき",
        "meaning": "autumn"
      }
    ]
  },
  {
    "day": 13,
    "range": "229-250",
    "kanji": [
      {
        "char": "堂",
        "level": "N4",
        "word": "食堂",
        "reading": "しょくどう",
        "meaning": "dining hall"
      },
      {
        "char": "週",
        "level": "N4",
        "word": "来週",
        "reading": "らいしゅう",
        "meaning": "next week"
      },
      {
        "char": "習",
        "level": "N4",
        "word": "習う",
        "reading": "ならう",
        "meaning": "learn from someone"
      },
      {
        "char": "試",
        "level": "N4",
        "word": "試験",
        "reading": "しけん",
        "meaning": "examination"
      },
      {
        "char": "夏",
        "level": "N4",
        "word": "夏",
        "reading": "なつ",
        "meaning": "summer"
      },
      {
        "char": "弟",
        "level": "N4",
        "word": "弟",
        "reading": "おとうと",
        "meaning": "my younger brother"
      },
      {
        "char": "鳥",
        "level": "N4",
        "word": "鳥",
        "reading": "とり",
        "meaning": "bird"
      },
      {
        "char": "犬",
        "level": "N4",
        "word": "犬",
        "reading": "いぬ",
        "meaning": "dog"
      },
      {
        "char": "夕",
        "level": "N4",
        "word": "夕方",
        "reading": "ゆうがた",
        "meaning": "early evening"
      },
      {
        "char": "魚",
        "level": "N4",
        "word": "魚",
        "reading": "さかな",
        "meaning": "fish"
      },
      {
        "char": "借",
        "level": "N4",
        "word": "借りる",
        "reading": "かりる",
        "meaning": "borrow"
      },
      {
        "char": "飯",
        "level": "N4",
        "word": "ご飯",
        "reading": "ごはん",
        "meaning": "rice or meal"
      },
      {
        "char": "駅",
        "level": "N4",
        "word": "駅",
        "reading": "えき",
        "meaning": "station"
      },
      {
        "char": "昼",
        "level": "N4",
        "word": "昼",
        "reading": "ひる",
        "meaning": "daytime or noon"
      },
      {
        "char": "冬",
        "level": "N4",
        "word": "冬",
        "reading": "ふゆ",
        "meaning": "winter"
      },
      {
        "char": "姉",
        "level": "N4",
        "word": "姉",
        "reading": "あね",
        "meaning": "my older sister"
      },
      {
        "char": "曜",
        "level": "N4",
        "word": "日曜日",
        "reading": "にちようび",
        "meaning": "Sunday"
      },
      {
        "char": "漢",
        "level": "N4",
        "word": "漢字",
        "reading": "かんじ",
        "meaning": "kanji character"
      },
      {
        "char": "牛",
        "level": "N4",
        "word": "牛乳",
        "reading": "ぎゅうにゅう",
        "meaning": "milk"
      },
      {
        "char": "妹",
        "level": "N4",
        "word": "妹",
        "reading": "いもうと",
        "meaning": "my younger sister"
      },
      {
        "char": "貸",
        "level": "N4",
        "word": "貸す",
        "reading": "かす",
        "meaning": "lend"
      },
      {
        "char": "勉",
        "level": "N4",
        "word": "勉強",
        "reading": "べんきょう",
        "meaning": "study"
      }
    ]
  },
  {
    "day": 14,
    "range": "251-276",
    "kanji": [
      {
        "char": "合",
        "level": "N3",
        "word": "合う",
        "reading": "あう",
        "meaning": "fit or match"
      },
      {
        "char": "部",
        "level": "N3",
        "word": "部分",
        "reading": "ぶぶん",
        "meaning": "part or section"
      },
      {
        "char": "彼",
        "level": "N3",
        "word": "彼",
        "reading": "かれ",
        "meaning": "he or boyfriend"
      },
      {
        "char": "内",
        "level": "N3",
        "word": "内容",
        "reading": "ないよう",
        "meaning": "content"
      },
      {
        "char": "実",
        "level": "N3",
        "word": "実は",
        "reading": "じつは",
        "meaning": "actually"
      },
      {
        "char": "当",
        "level": "N3",
        "word": "本当",
        "reading": "ほんとう",
        "meaning": "truth or really"
      },
      {
        "char": "戦",
        "level": "N3",
        "word": "戦争",
        "reading": "せんそう",
        "meaning": "war"
      },
      {
        "char": "性",
        "level": "N3",
        "word": "性格",
        "reading": "せいかく",
        "meaning": "personality"
      },
      {
        "char": "対",
        "level": "N3",
        "word": "反対",
        "reading": "はんたい",
        "meaning": "opposition or opposite"
      },
      {
        "char": "関",
        "level": "N3",
        "word": "関係",
        "reading": "かんけい",
        "meaning": "relationship"
      },
      {
        "char": "感",
        "level": "N3",
        "word": "感じる",
        "reading": "かんじる",
        "meaning": "feel"
      },
      {
        "char": "定",
        "level": "N3",
        "word": "予定",
        "reading": "よてい",
        "meaning": "plan or schedule"
      },
      {
        "char": "政",
        "level": "N3",
        "word": "政治",
        "reading": "せいじ",
        "meaning": "politics"
      },
      {
        "char": "取",
        "level": "N3",
        "word": "取る",
        "reading": "とる",
        "meaning": "take"
      },
      {
        "char": "所",
        "level": "N3",
        "word": "近所",
        "reading": "きんじょ",
        "meaning": "neighbourhood"
      },
      {
        "char": "現",
        "level": "N3",
        "word": "現在",
        "reading": "げんざい",
        "meaning": "present time"
      },
      {
        "char": "最",
        "level": "N3",
        "word": "最近",
        "reading": "さいきん",
        "meaning": "recently"
      },
      {
        "char": "化",
        "level": "N3",
        "word": "文化",
        "reading": "ぶんか",
        "meaning": "culture"
      },
      {
        "char": "民",
        "level": "N3",
        "word": "市民",
        "reading": "しみん",
        "meaning": "citizen"
      },
      {
        "char": "相",
        "level": "N3",
        "word": "相談",
        "reading": "そうだん",
        "meaning": "consultation"
      },
      {
        "char": "法",
        "level": "N3",
        "word": "方法",
        "reading": "ほうほう",
        "meaning": "method"
      },
      {
        "char": "全",
        "level": "N3",
        "word": "全部",
        "reading": "ぜんぶ",
        "meaning": "all"
      },
      {
        "char": "情",
        "level": "N3",
        "word": "情報",
        "reading": "じょうほう",
        "meaning": "information"
      },
      {
        "char": "向",
        "level": "N3",
        "word": "向かう",
        "reading": "むかう",
        "meaning": "head toward"
      },
      {
        "char": "平",
        "level": "N3",
        "word": "平日",
        "reading": "へいじつ",
        "meaning": "weekday"
      },
      {
        "char": "成",
        "level": "N3",
        "word": "成功",
        "reading": "せいこう",
        "meaning": "success"
      }
    ]
  },
  {
    "day": 15,
    "range": "277-302",
    "kanji": [
      {
        "char": "経",
        "level": "N3",
        "word": "経済",
        "reading": "けいざい",
        "meaning": "economy"
      },
      {
        "char": "信",
        "level": "N3",
        "word": "信じる",
        "reading": "しんじる",
        "meaning": "believe"
      },
      {
        "char": "面",
        "level": "N3",
        "word": "画面",
        "reading": "がめん",
        "meaning": "screen"
      },
      {
        "char": "連",
        "level": "N3",
        "word": "連絡",
        "reading": "れんらく",
        "meaning": "contact"
      },
      {
        "char": "原",
        "level": "N3",
        "word": "原因",
        "reading": "げんいん",
        "meaning": "cause"
      },
      {
        "char": "顔",
        "level": "N3",
        "word": "顔",
        "reading": "かお",
        "meaning": "face"
      },
      {
        "char": "機",
        "level": "N3",
        "word": "機会",
        "reading": "きかい",
        "meaning": "opportunity"
      },
      {
        "char": "次",
        "level": "N3",
        "word": "次",
        "reading": "つぎ",
        "meaning": "next"
      },
      {
        "char": "数",
        "level": "N3",
        "word": "数字",
        "reading": "すうじ",
        "meaning": "numeral"
      },
      {
        "char": "美",
        "level": "N3",
        "word": "美しい",
        "reading": "うつくしい",
        "meaning": "beautiful"
      },
      {
        "char": "回",
        "level": "N3",
        "word": "今回",
        "reading": "こんかい",
        "meaning": "this time"
      },
      {
        "char": "表",
        "level": "N3",
        "word": "発表",
        "reading": "はっぴょう",
        "meaning": "presentation or announcement"
      },
      {
        "char": "声",
        "level": "N3",
        "word": "声",
        "reading": "こえ",
        "meaning": "voice"
      },
      {
        "char": "報",
        "level": "N3",
        "word": "報告",
        "reading": "ほうこく",
        "meaning": "report"
      },
      {
        "char": "要",
        "level": "N3",
        "word": "必要",
        "reading": "ひつよう",
        "meaning": "necessary"
      },
      {
        "char": "変",
        "level": "N3",
        "word": "変更",
        "reading": "へんこう",
        "meaning": "change or alteration"
      },
      {
        "char": "神",
        "level": "N3",
        "word": "神社",
        "reading": "じんじゃ",
        "meaning": "Shinto shrine"
      },
      {
        "char": "記",
        "level": "N3",
        "word": "日記",
        "reading": "にっき",
        "meaning": "diary"
      },
      {
        "char": "和",
        "level": "N3",
        "word": "平和",
        "reading": "へいわ",
        "meaning": "peace"
      },
      {
        "char": "引",
        "level": "N3",
        "word": "引く",
        "reading": "ひく",
        "meaning": "pull"
      },
      {
        "char": "治",
        "level": "N3",
        "word": "治る",
        "reading": "なおる",
        "meaning": "recover or heal"
      },
      {
        "char": "決",
        "level": "N3",
        "word": "決める",
        "reading": "きめる",
        "meaning": "decide"
      },
      {
        "char": "太",
        "level": "N3",
        "word": "太い",
        "reading": "ふとい",
        "meaning": "thick"
      },
      {
        "char": "込",
        "level": "N3",
        "word": "申し込む",
        "reading": "もうしこむ",
        "meaning": "apply or register"
      },
      {
        "char": "受",
        "level": "N3",
        "word": "受ける",
        "reading": "うける",
        "meaning": "receive or take an exam"
      },
      {
        "char": "解",
        "level": "N3",
        "word": "解く",
        "reading": "とく",
        "meaning": "solve"
      }
    ]
  },
  {
    "day": 16,
    "range": "303-329",
    "kanji": [
      {
        "char": "市",
        "level": "N3",
        "word": "市場",
        "reading": "いちば",
        "meaning": "marketplace"
      },
      {
        "char": "期",
        "level": "N3",
        "word": "期間",
        "reading": "きかん",
        "meaning": "period of time"
      },
      {
        "char": "様",
        "level": "N3",
        "word": "様子",
        "reading": "ようす",
        "meaning": "state or appearance"
      },
      {
        "char": "活",
        "level": "N3",
        "word": "生活",
        "reading": "せいかつ",
        "meaning": "daily life"
      },
      {
        "char": "頭",
        "level": "N3",
        "word": "頭",
        "reading": "あたま",
        "meaning": "head"
      },
      {
        "char": "組",
        "level": "N3",
        "word": "番組",
        "reading": "ばんぐみ",
        "meaning": "broadcast programme"
      },
      {
        "char": "指",
        "level": "N3",
        "word": "指",
        "reading": "ゆび",
        "meaning": "finger"
      },
      {
        "char": "説",
        "level": "N3",
        "word": "説明",
        "reading": "せつめい",
        "meaning": "explanation"
      },
      {
        "char": "能",
        "level": "N3",
        "word": "能力",
        "reading": "のうりょく",
        "meaning": "ability"
      },
      {
        "char": "葉",
        "level": "N3",
        "word": "言葉",
        "reading": "ことば",
        "meaning": "word or language"
      },
      {
        "char": "流",
        "level": "N3",
        "word": "流れる",
        "reading": "ながれる",
        "meaning": "flow"
      },
      {
        "char": "然",
        "level": "N3",
        "word": "自然",
        "reading": "しぜん",
        "meaning": "nature or natural"
      },
      {
        "char": "初",
        "level": "N3",
        "word": "初めて",
        "reading": "はじめて",
        "meaning": "for the first time"
      },
      {
        "char": "在",
        "level": "N3",
        "word": "存在",
        "reading": "そんざい",
        "meaning": "existence"
      },
      {
        "char": "調",
        "level": "N3",
        "word": "調べる",
        "reading": "しらべる",
        "meaning": "investigate or look up"
      },
      {
        "char": "笑",
        "level": "N3",
        "word": "笑う",
        "reading": "わらう",
        "meaning": "laugh or smile"
      },
      {
        "char": "議",
        "level": "N3",
        "word": "会議",
        "reading": "かいぎ",
        "meaning": "meeting"
      },
      {
        "char": "直",
        "level": "N3",
        "word": "直す",
        "reading": "なおす",
        "meaning": "correct or repair"
      },
      {
        "char": "夫",
        "level": "N3",
        "word": "夫",
        "reading": "おっと",
        "meaning": "my husband"
      },
      {
        "char": "選",
        "level": "N3",
        "word": "選ぶ",
        "reading": "えらぶ",
        "meaning": "choose"
      },
      {
        "char": "権",
        "level": "N3",
        "word": "権利",
        "reading": "けんり",
        "meaning": "right or entitlement"
      },
      {
        "char": "利",
        "level": "N3",
        "word": "便利",
        "reading": "べんり",
        "meaning": "convenient"
      },
      {
        "char": "制",
        "level": "N3",
        "word": "制度",
        "reading": "せいど",
        "meaning": "system or institution"
      },
      {
        "char": "続",
        "level": "N3",
        "word": "続ける",
        "reading": "つづける",
        "meaning": "continue something"
      },
      {
        "char": "石",
        "level": "N3",
        "word": "石",
        "reading": "いし",
        "meaning": "stone"
      },
      {
        "char": "進",
        "level": "N3",
        "word": "進む",
        "reading": "すすむ",
        "meaning": "advance"
      },
      {
        "char": "伝",
        "level": "N3",
        "word": "伝える",
        "reading": "つたえる",
        "meaning": "convey"
      }
    ]
  },
  {
    "day": 17,
    "range": "330-355",
    "kanji": [
      {
        "char": "加",
        "level": "N3",
        "word": "参加",
        "reading": "さんか",
        "meaning": "participation"
      },
      {
        "char": "助",
        "level": "N3",
        "word": "助ける",
        "reading": "たすける",
        "meaning": "help"
      },
      {
        "char": "点",
        "level": "N3",
        "word": "点数",
        "reading": "てんすう",
        "meaning": "score"
      },
      {
        "char": "産",
        "level": "N3",
        "word": "生産",
        "reading": "せいさん",
        "meaning": "production"
      },
      {
        "char": "務",
        "level": "N3",
        "word": "事務",
        "reading": "じむ",
        "meaning": "office work"
      },
      {
        "char": "件",
        "level": "N3",
        "word": "条件",
        "reading": "じょうけん",
        "meaning": "condition"
      },
      {
        "char": "命",
        "level": "N3",
        "word": "命",
        "reading": "いのち",
        "meaning": "life"
      },
      {
        "char": "番",
        "level": "N3",
        "word": "順番",
        "reading": "じゅんばん",
        "meaning": "order or turn"
      },
      {
        "char": "落",
        "level": "N3",
        "word": "落ちる",
        "reading": "おちる",
        "meaning": "fall"
      },
      {
        "char": "付",
        "level": "N3",
        "word": "付ける",
        "reading": "つける",
        "meaning": "attach"
      },
      {
        "char": "得",
        "level": "N3",
        "word": "得意",
        "reading": "とくい",
        "meaning": "good at"
      },
      {
        "char": "好",
        "level": "N3",
        "word": "好み",
        "reading": "このみ",
        "meaning": "preference"
      },
      {
        "char": "違",
        "level": "N3",
        "word": "違う",
        "reading": "ちがう",
        "meaning": "differ or be wrong"
      },
      {
        "char": "殺",
        "level": "N3",
        "word": "殺す",
        "reading": "ころす",
        "meaning": "kill"
      },
      {
        "char": "置",
        "level": "N3",
        "word": "置く",
        "reading": "おく",
        "meaning": "put or place"
      },
      {
        "char": "返",
        "level": "N3",
        "word": "返す",
        "reading": "かえす",
        "meaning": "return something"
      },
      {
        "char": "論",
        "level": "N3",
        "word": "議論",
        "reading": "ぎろん",
        "meaning": "discussion or debate"
      },
      {
        "char": "際",
        "level": "N3",
        "word": "実際",
        "reading": "じっさい",
        "meaning": "actually or in practice"
      },
      {
        "char": "歳",
        "level": "N3",
        "word": "二十歳",
        "reading": "はたち",
        "meaning": "twenty years old"
      },
      {
        "char": "反",
        "level": "N3",
        "word": "反省",
        "reading": "はんせい",
        "meaning": "reflection on one's conduct"
      },
      {
        "char": "形",
        "level": "N3",
        "word": "形",
        "reading": "かたち",
        "meaning": "shape"
      },
      {
        "char": "光",
        "level": "N3",
        "word": "光",
        "reading": "ひかり",
        "meaning": "light"
      },
      {
        "char": "首",
        "level": "N3",
        "word": "首",
        "reading": "くび",
        "meaning": "neck"
      },
      {
        "char": "勝",
        "level": "N3",
        "word": "勝つ",
        "reading": "かつ",
        "meaning": "win"
      },
      {
        "char": "必",
        "level": "N3",
        "word": "必ず",
        "reading": "かならず",
        "meaning": "without fail"
      },
      {
        "char": "係",
        "level": "N3",
        "word": "係",
        "reading": "かかり",
        "meaning": "person in charge"
      }
    ]
  },
  {
    "day": 18,
    "range": "356-382",
    "kanji": [
      {
        "char": "由",
        "level": "N3",
        "word": "自由",
        "reading": "じゆう",
        "meaning": "freedom"
      },
      {
        "char": "愛",
        "level": "N3",
        "word": "愛情",
        "reading": "あいじょう",
        "meaning": "affection"
      },
      {
        "char": "都",
        "level": "N3",
        "word": "都会",
        "reading": "とかい",
        "meaning": "city or urban area"
      },
      {
        "char": "放",
        "level": "N3",
        "word": "放送",
        "reading": "ほうそう",
        "meaning": "broadcast"
      },
      {
        "char": "確",
        "level": "N3",
        "word": "確かめる",
        "reading": "たしかめる",
        "meaning": "make sure"
      },
      {
        "char": "過",
        "level": "N3",
        "word": "過ぎる",
        "reading": "すぎる",
        "meaning": "pass or exceed"
      },
      {
        "char": "約",
        "level": "N3",
        "word": "約束",
        "reading": "やくそく",
        "meaning": "promise or appointment"
      },
      {
        "char": "馬",
        "level": "N3",
        "word": "馬",
        "reading": "うま",
        "meaning": "horse"
      },
      {
        "char": "状",
        "level": "N3",
        "word": "状況",
        "reading": "じょうきょう",
        "meaning": "situation"
      },
      {
        "char": "想",
        "level": "N3",
        "word": "感想",
        "reading": "かんそう",
        "meaning": "impressions"
      },
      {
        "char": "官",
        "level": "N3",
        "word": "警官",
        "reading": "けいかん",
        "meaning": "police officer"
      },
      {
        "char": "交",
        "level": "N3",
        "word": "交通",
        "reading": "こうつう",
        "meaning": "traffic or transport"
      },
      {
        "char": "米",
        "level": "N3",
        "word": "米",
        "reading": "こめ",
        "meaning": "uncooked rice"
      },
      {
        "char": "配",
        "level": "N3",
        "word": "心配",
        "reading": "しんぱい",
        "meaning": "worry"
      },
      {
        "char": "若",
        "level": "N3",
        "word": "若い",
        "reading": "わかい",
        "meaning": "young"
      },
      {
        "char": "資",
        "level": "N3",
        "word": "資料",
        "reading": "しりょう",
        "meaning": "materials or documents"
      },
      {
        "char": "常",
        "level": "N3",
        "word": "日常",
        "reading": "にちじょう",
        "meaning": "everyday life"
      },
      {
        "char": "果",
        "level": "N3",
        "word": "結果",
        "reading": "けっか",
        "meaning": "result"
      },
      {
        "char": "呼",
        "level": "N3",
        "word": "呼ぶ",
        "reading": "よぶ",
        "meaning": "call"
      },
      {
        "char": "共",
        "level": "N3",
        "word": "共通",
        "reading": "きょうつう",
        "meaning": "shared or common"
      },
      {
        "char": "残",
        "level": "N3",
        "word": "残る",
        "reading": "のこる",
        "meaning": "remain"
      },
      {
        "char": "判",
        "level": "N3",
        "word": "判断",
        "reading": "はんだん",
        "meaning": "judgment"
      },
      {
        "char": "役",
        "level": "N3",
        "word": "役に立つ",
        "reading": "やくにたつ",
        "meaning": "be useful"
      },
      {
        "char": "他",
        "level": "N3",
        "word": "他",
        "reading": "ほか",
        "meaning": "other"
      },
      {
        "char": "術",
        "level": "N3",
        "word": "手術",
        "reading": "しゅじゅつ",
        "meaning": "surgery"
      },
      {
        "char": "支",
        "level": "N3",
        "word": "支える",
        "reading": "ささえる",
        "meaning": "support"
      },
      {
        "char": "両",
        "level": "N3",
        "word": "両方",
        "reading": "りょうほう",
        "meaning": "both"
      }
    ]
  },
  {
    "day": 19,
    "range": "383-408",
    "kanji": [
      {
        "char": "乗",
        "level": "N3",
        "word": "乗る",
        "reading": "のる",
        "meaning": "board or ride"
      },
      {
        "char": "済",
        "level": "N3",
        "word": "済む",
        "reading": "すむ",
        "meaning": "be finished"
      },
      {
        "char": "供",
        "level": "N3",
        "word": "子供",
        "reading": "こども",
        "meaning": "child"
      },
      {
        "char": "格",
        "level": "N3",
        "word": "合格",
        "reading": "ごうかく",
        "meaning": "passing an exam"
      },
      {
        "char": "打",
        "level": "N3",
        "word": "打つ",
        "reading": "うつ",
        "meaning": "hit or type"
      },
      {
        "char": "御",
        "level": "N3",
        "word": "御礼",
        "reading": "おれい",
        "meaning": "thanks or gratitude"
      },
      {
        "char": "断",
        "level": "N3",
        "word": "断る",
        "reading": "ことわる",
        "meaning": "refuse"
      },
      {
        "char": "式",
        "level": "N3",
        "word": "式",
        "reading": "しき",
        "meaning": "ceremony or formula"
      },
      {
        "char": "師",
        "level": "N3",
        "word": "教師",
        "reading": "きょうし",
        "meaning": "teacher"
      },
      {
        "char": "告",
        "level": "N3",
        "word": "広告",
        "reading": "こうこく",
        "meaning": "advertisement"
      },
      {
        "char": "深",
        "level": "N3",
        "word": "深い",
        "reading": "ふかい",
        "meaning": "deep"
      },
      {
        "char": "存",
        "level": "N3",
        "word": "保存",
        "reading": "ほぞん",
        "meaning": "preservation or saving data"
      },
      {
        "char": "争",
        "level": "N3",
        "word": "争う",
        "reading": "あらそう",
        "meaning": "compete or dispute"
      },
      {
        "char": "覚",
        "level": "N3",
        "word": "覚える",
        "reading": "おぼえる",
        "meaning": "memorise"
      },
      {
        "char": "側",
        "level": "N3",
        "word": "側",
        "reading": "がわ",
        "meaning": "side"
      },
      {
        "char": "飛",
        "level": "N3",
        "word": "飛ぶ",
        "reading": "とぶ",
        "meaning": "fly"
      },
      {
        "char": "参",
        "level": "N3",
        "word": "参る",
        "reading": "まいる",
        "meaning": "go or come humbly"
      },
      {
        "char": "突",
        "level": "N3",
        "word": "突然",
        "reading": "とつぜん",
        "meaning": "suddenly"
      },
      {
        "char": "容",
        "level": "N3",
        "word": "容器",
        "reading": "ようき",
        "meaning": "container"
      },
      {
        "char": "育",
        "level": "N3",
        "word": "育てる",
        "reading": "そだてる",
        "meaning": "raise or grow something"
      },
      {
        "char": "構",
        "level": "N3",
        "word": "構う",
        "reading": "かまう",
        "meaning": "mind or care about"
      },
      {
        "char": "認",
        "level": "N3",
        "word": "認める",
        "reading": "みとめる",
        "meaning": "recognise or admit"
      },
      {
        "char": "位",
        "level": "N3",
        "word": "位置",
        "reading": "いち",
        "meaning": "position"
      },
      {
        "char": "達",
        "level": "N3",
        "word": "達する",
        "reading": "たっする",
        "meaning": "reach"
      },
      {
        "char": "守",
        "level": "N3",
        "word": "守る",
        "reading": "まもる",
        "meaning": "protect or obey"
      },
      {
        "char": "満",
        "level": "N3",
        "word": "満足",
        "reading": "まんぞく",
        "meaning": "satisfaction"
      }
    ]
  },
  {
    "day": 20,
    "range": "409-435",
    "kanji": [
      {
        "char": "消",
        "level": "N3",
        "word": "消す",
        "reading": "けす",
        "meaning": "erase or switch off"
      },
      {
        "char": "任",
        "level": "N3",
        "word": "任せる",
        "reading": "まかせる",
        "meaning": "entrust"
      },
      {
        "char": "居",
        "level": "N3",
        "word": "居る",
        "reading": "いる",
        "meaning": "be present for living things"
      },
      {
        "char": "予",
        "level": "N3",
        "word": "予約",
        "reading": "よやく",
        "meaning": "reservation"
      },
      {
        "char": "路",
        "level": "N3",
        "word": "道路",
        "reading": "どうろ",
        "meaning": "road"
      },
      {
        "char": "座",
        "level": "N3",
        "word": "座る",
        "reading": "すわる",
        "meaning": "sit"
      },
      {
        "char": "客",
        "level": "N3",
        "word": "お客さん",
        "reading": "おきゃくさん",
        "meaning": "customer or guest"
      },
      {
        "char": "船",
        "level": "N3",
        "word": "船",
        "reading": "ふね",
        "meaning": "ship or boat"
      },
      {
        "char": "追",
        "level": "N3",
        "word": "追う",
        "reading": "おう",
        "meaning": "chase"
      },
      {
        "char": "背",
        "level": "N3",
        "word": "背中",
        "reading": "せなか",
        "meaning": "back of the body"
      },
      {
        "char": "観",
        "level": "N3",
        "word": "観光",
        "reading": "かんこう",
        "meaning": "sightseeing"
      },
      {
        "char": "誰",
        "level": "N3",
        "word": "誰",
        "reading": "だれ",
        "meaning": "who"
      },
      {
        "char": "息",
        "level": "N3",
        "word": "息",
        "reading": "いき",
        "meaning": "breath"
      },
      {
        "char": "失",
        "level": "N3",
        "word": "失敗",
        "reading": "しっぱい",
        "meaning": "failure or mistake"
      },
      {
        "char": "老",
        "level": "N3",
        "word": "老人",
        "reading": "ろうじん",
        "meaning": "elderly person"
      },
      {
        "char": "良",
        "level": "N3",
        "word": "良い",
        "reading": "よい",
        "meaning": "good"
      },
      {
        "char": "示",
        "level": "N3",
        "word": "示す",
        "reading": "しめす",
        "meaning": "show or indicate"
      },
      {
        "char": "号",
        "level": "N3",
        "word": "番号",
        "reading": "ばんごう",
        "meaning": "number"
      },
      {
        "char": "職",
        "level": "N3",
        "word": "職場",
        "reading": "しょくば",
        "meaning": "workplace"
      },
      {
        "char": "王",
        "level": "N3",
        "word": "王様",
        "reading": "おうさま",
        "meaning": "king"
      },
      {
        "char": "識",
        "level": "N3",
        "word": "知識",
        "reading": "ちしき",
        "meaning": "knowledge"
      },
      {
        "char": "警",
        "level": "N3",
        "word": "警察",
        "reading": "けいさつ",
        "meaning": "police"
      },
      {
        "char": "優",
        "level": "N3",
        "word": "優しい",
        "reading": "やさしい",
        "meaning": "kind or gentle"
      },
      {
        "char": "投",
        "level": "N3",
        "word": "投げる",
        "reading": "なげる",
        "meaning": "throw"
      },
      {
        "char": "局",
        "level": "N3",
        "word": "郵便局",
        "reading": "ゆうびんきょく",
        "meaning": "post office"
      },
      {
        "char": "難",
        "level": "N3",
        "word": "難しい",
        "reading": "むずかしい",
        "meaning": "difficult"
      },
      {
        "char": "種",
        "level": "N3",
        "word": "種類",
        "reading": "しゅるい",
        "meaning": "type or variety"
      }
    ]
  },
  {
    "day": 21,
    "range": "436-461",
    "kanji": [
      {
        "char": "念",
        "level": "N3",
        "word": "残念",
        "reading": "ざんねん",
        "meaning": "disappointing or unfortunate"
      },
      {
        "char": "寄",
        "level": "N3",
        "word": "寄る",
        "reading": "よる",
        "meaning": "stop by"
      },
      {
        "char": "商",
        "level": "N3",
        "word": "商品",
        "reading": "しょうひん",
        "meaning": "product"
      },
      {
        "char": "害",
        "level": "N3",
        "word": "被害",
        "reading": "ひがい",
        "meaning": "damage suffered"
      },
      {
        "char": "頼",
        "level": "N3",
        "word": "頼む",
        "reading": "たのむ",
        "meaning": "request"
      },
      {
        "char": "横",
        "level": "N3",
        "word": "横",
        "reading": "よこ",
        "meaning": "side or horizontal"
      },
      {
        "char": "増",
        "level": "N3",
        "word": "増える",
        "reading": "ふえる",
        "meaning": "increase"
      },
      {
        "char": "差",
        "level": "N3",
        "word": "差",
        "reading": "さ",
        "meaning": "difference"
      },
      {
        "char": "苦",
        "level": "N3",
        "word": "苦手",
        "reading": "にがて",
        "meaning": "not good at"
      },
      {
        "char": "収",
        "level": "N3",
        "word": "収入",
        "reading": "しゅうにゅう",
        "meaning": "income"
      },
      {
        "char": "段",
        "level": "N3",
        "word": "階段",
        "reading": "かいだん",
        "meaning": "stairs"
      },
      {
        "char": "俺",
        "level": "N3",
        "word": "俺",
        "reading": "おれ",
        "meaning": "I in rough familiar speech"
      },
      {
        "char": "渡",
        "level": "N3",
        "word": "渡る",
        "reading": "わたる",
        "meaning": "cross"
      },
      {
        "char": "与",
        "level": "N3",
        "word": "与える",
        "reading": "あたえる",
        "meaning": "give or provide"
      },
      {
        "char": "演",
        "level": "N3",
        "word": "演奏",
        "reading": "えんそう",
        "meaning": "musical performance"
      },
      {
        "char": "備",
        "level": "N3",
        "word": "準備",
        "reading": "じゅんび",
        "meaning": "preparation"
      },
      {
        "char": "申",
        "level": "N3",
        "word": "申す",
        "reading": "もうす",
        "meaning": "say humbly"
      },
      {
        "char": "例",
        "level": "N3",
        "word": "例えば",
        "reading": "たとえば",
        "meaning": "for example"
      },
      {
        "char": "働",
        "level": "N3",
        "word": "働く",
        "reading": "はたらく",
        "meaning": "work"
      },
      {
        "char": "景",
        "level": "N3",
        "word": "景色",
        "reading": "けしき",
        "meaning": "scenery"
      },
      {
        "char": "抜",
        "level": "N3",
        "word": "抜く",
        "reading": "ぬく",
        "meaning": "pull out"
      },
      {
        "char": "遠",
        "level": "N3",
        "word": "遠い",
        "reading": "とおい",
        "meaning": "far"
      },
      {
        "char": "絶",
        "level": "N3",
        "word": "絶対",
        "reading": "ぜったい",
        "meaning": "absolutely"
      },
      {
        "char": "負",
        "level": "N3",
        "word": "負ける",
        "reading": "まける",
        "meaning": "lose"
      },
      {
        "char": "福",
        "level": "N3",
        "word": "幸福",
        "reading": "こうふく",
        "meaning": "happiness"
      },
      {
        "char": "球",
        "level": "N3",
        "word": "地球",
        "reading": "ちきゅう",
        "meaning": "Earth"
      }
    ]
  },
  {
    "day": 22,
    "range": "462-487",
    "kanji": [
      {
        "char": "酒",
        "level": "N3",
        "word": "お酒",
        "reading": "おさけ",
        "meaning": "alcohol"
      },
      {
        "char": "君",
        "level": "N3",
        "word": "君",
        "reading": "きみ",
        "meaning": "you in familiar speech"
      },
      {
        "char": "察",
        "level": "N3",
        "word": "観察",
        "reading": "かんさつ",
        "meaning": "observation"
      },
      {
        "char": "望",
        "level": "N3",
        "word": "希望",
        "reading": "きぼう",
        "meaning": "hope or wish"
      },
      {
        "char": "婚",
        "level": "N3",
        "word": "結婚",
        "reading": "けっこん",
        "meaning": "marriage"
      },
      {
        "char": "単",
        "level": "N3",
        "word": "簡単",
        "reading": "かんたん",
        "meaning": "simple"
      },
      {
        "char": "押",
        "level": "N3",
        "word": "押す",
        "reading": "おす",
        "meaning": "push"
      },
      {
        "char": "割",
        "level": "N3",
        "word": "割合",
        "reading": "わりあい",
        "meaning": "ratio or proportion"
      },
      {
        "char": "限",
        "level": "N3",
        "word": "限る",
        "reading": "かぎる",
        "meaning": "limit"
      },
      {
        "char": "戻",
        "level": "N3",
        "word": "戻る",
        "reading": "もどる",
        "meaning": "return"
      },
      {
        "char": "科",
        "level": "N3",
        "word": "科学",
        "reading": "かがく",
        "meaning": "science"
      },
      {
        "char": "求",
        "level": "N3",
        "word": "求める",
        "reading": "もとめる",
        "meaning": "seek or request"
      },
      {
        "char": "談",
        "level": "N3",
        "word": "面談",
        "reading": "めんだん",
        "meaning": "interview or consultation"
      },
      {
        "char": "降",
        "level": "N3",
        "word": "降りる",
        "reading": "おりる",
        "meaning": "get off or descend"
      },
      {
        "char": "妻",
        "level": "N3",
        "word": "妻",
        "reading": "つま",
        "meaning": "my wife"
      },
      {
        "char": "岡",
        "level": "N3",
        "word": "静岡",
        "reading": "しずおか",
        "meaning": "Shizuoka"
      },
      {
        "char": "熱",
        "level": "N3",
        "word": "熱",
        "reading": "ねつ",
        "meaning": "fever or heat"
      },
      {
        "char": "浮",
        "level": "N3",
        "word": "浮く",
        "reading": "うく",
        "meaning": "float"
      },
      {
        "char": "等",
        "level": "N3",
        "word": "等しい",
        "reading": "ひとしい",
        "meaning": "equal"
      },
      {
        "char": "末",
        "level": "N3",
        "word": "週末",
        "reading": "しゅうまつ",
        "meaning": "weekend"
      },
      {
        "char": "幸",
        "level": "N3",
        "word": "幸せ",
        "reading": "しあわせ",
        "meaning": "happiness"
      },
      {
        "char": "草",
        "level": "N3",
        "word": "草",
        "reading": "くさ",
        "meaning": "grass"
      },
      {
        "char": "越",
        "level": "N3",
        "word": "引っ越す",
        "reading": "ひっこす",
        "meaning": "move house"
      },
      {
        "char": "登",
        "level": "N3",
        "word": "登る",
        "reading": "のぼる",
        "meaning": "climb"
      },
      {
        "char": "類",
        "level": "N3",
        "word": "書類",
        "reading": "しょるい",
        "meaning": "documents"
      },
      {
        "char": "未",
        "level": "N3",
        "word": "未来",
        "reading": "みらい",
        "meaning": "future"
      }
    ]
  },
  {
    "day": 23,
    "range": "488-514",
    "kanji": [
      {
        "char": "規",
        "level": "N3",
        "word": "規則",
        "reading": "きそく",
        "meaning": "rule"
      },
      {
        "char": "精",
        "level": "N3",
        "word": "精神",
        "reading": "せいしん",
        "meaning": "mind or spirit"
      },
      {
        "char": "抱",
        "level": "N3",
        "word": "抱く",
        "reading": "だく",
        "meaning": "hold in one's arms"
      },
      {
        "char": "労",
        "level": "N3",
        "word": "苦労",
        "reading": "くろう",
        "meaning": "hardship"
      },
      {
        "char": "処",
        "level": "N3",
        "word": "処理",
        "reading": "しょり",
        "meaning": "processing or handling"
      },
      {
        "char": "退",
        "level": "N3",
        "word": "退院",
        "reading": "たいいん",
        "meaning": "leaving hospital"
      },
      {
        "char": "費",
        "level": "N3",
        "word": "費用",
        "reading": "ひよう",
        "meaning": "cost"
      },
      {
        "char": "非",
        "level": "N3",
        "word": "非常に",
        "reading": "ひじょうに",
        "meaning": "extremely"
      },
      {
        "char": "喜",
        "level": "N3",
        "word": "喜ぶ",
        "reading": "よろこぶ",
        "meaning": "be pleased"
      },
      {
        "char": "娘",
        "level": "N3",
        "word": "娘",
        "reading": "むすめ",
        "meaning": "daughter"
      },
      {
        "char": "逃",
        "level": "N3",
        "word": "逃げる",
        "reading": "にげる",
        "meaning": "escape"
      },
      {
        "char": "探",
        "level": "N3",
        "word": "探す",
        "reading": "さがす",
        "meaning": "search for"
      },
      {
        "char": "犯",
        "level": "N3",
        "word": "犯人",
        "reading": "はんにん",
        "meaning": "offender"
      },
      {
        "char": "薬",
        "level": "N3",
        "word": "薬",
        "reading": "くすり",
        "meaning": "medicine"
      },
      {
        "char": "園",
        "level": "N3",
        "word": "動物園",
        "reading": "どうぶつえん",
        "meaning": "zoo"
      },
      {
        "char": "疑",
        "level": "N3",
        "word": "疑う",
        "reading": "うたがう",
        "meaning": "doubt or suspect"
      },
      {
        "char": "緒",
        "level": "N3",
        "word": "一緒",
        "reading": "いっしょ",
        "meaning": "together"
      },
      {
        "char": "静",
        "level": "N3",
        "word": "静か",
        "reading": "しずか",
        "meaning": "quiet"
      },
      {
        "char": "具",
        "level": "N3",
        "word": "道具",
        "reading": "どうぐ",
        "meaning": "tool"
      },
      {
        "char": "席",
        "level": "N3",
        "word": "席",
        "reading": "せき",
        "meaning": "seat"
      },
      {
        "char": "速",
        "level": "N3",
        "word": "速い",
        "reading": "はやい",
        "meaning": "fast"
      },
      {
        "char": "舞",
        "level": "N3",
        "word": "見舞い",
        "reading": "みまい",
        "meaning": "visit to a sick person"
      },
      {
        "char": "宿",
        "level": "N3",
        "word": "宿泊",
        "reading": "しゅくはく",
        "meaning": "overnight stay"
      },
      {
        "char": "程",
        "level": "N3",
        "word": "程度",
        "reading": "ていど",
        "meaning": "degree or extent"
      },
      {
        "char": "倒",
        "level": "N3",
        "word": "倒れる",
        "reading": "たおれる",
        "meaning": "fall over or collapse"
      },
      {
        "char": "寝",
        "level": "N3",
        "word": "寝る",
        "reading": "ねる",
        "meaning": "sleep"
      },
      {
        "char": "宅",
        "level": "N3",
        "word": "自宅",
        "reading": "じたく",
        "meaning": "one's home"
      }
    ]
  },
  {
    "day": 24,
    "range": "515-540",
    "kanji": [
      {
        "char": "絵",
        "level": "N3",
        "word": "絵",
        "reading": "え",
        "meaning": "picture or painting"
      },
      {
        "char": "破",
        "level": "N3",
        "word": "破る",
        "reading": "やぶる",
        "meaning": "tear or break a rule"
      },
      {
        "char": "庭",
        "level": "N3",
        "word": "庭",
        "reading": "にわ",
        "meaning": "garden"
      },
      {
        "char": "婦",
        "level": "N3",
        "word": "夫婦",
        "reading": "ふうふ",
        "meaning": "married couple"
      },
      {
        "char": "余",
        "level": "N3",
        "word": "余る",
        "reading": "あまる",
        "meaning": "be left over"
      },
      {
        "char": "訪",
        "level": "N3",
        "word": "訪ねる",
        "reading": "たずねる",
        "meaning": "visit"
      },
      {
        "char": "冷",
        "level": "N3",
        "word": "冷たい",
        "reading": "つめたい",
        "meaning": "cold to the touch"
      },
      {
        "char": "暮",
        "level": "N3",
        "word": "暮らす",
        "reading": "くらす",
        "meaning": "live or make a living"
      },
      {
        "char": "腹",
        "level": "N3",
        "word": "お腹",
        "reading": "おなか",
        "meaning": "stomach"
      },
      {
        "char": "危",
        "level": "N3",
        "word": "危ない",
        "reading": "あぶない",
        "meaning": "dangerous"
      },
      {
        "char": "許",
        "level": "N3",
        "word": "許す",
        "reading": "ゆるす",
        "meaning": "permit or forgive"
      },
      {
        "char": "似",
        "level": "N3",
        "word": "似る",
        "reading": "にる",
        "meaning": "resemble"
      },
      {
        "char": "険",
        "level": "N3",
        "word": "危険",
        "reading": "きけん",
        "meaning": "danger"
      },
      {
        "char": "財",
        "level": "N3",
        "word": "財布",
        "reading": "さいふ",
        "meaning": "wallet"
      },
      {
        "char": "遊",
        "level": "N3",
        "word": "遊ぶ",
        "reading": "あそぶ",
        "meaning": "play"
      },
      {
        "char": "雑",
        "level": "N3",
        "word": "複雑",
        "reading": "ふくざつ",
        "meaning": "complicated"
      },
      {
        "char": "恐",
        "level": "N3",
        "word": "恐ろしい",
        "reading": "おそろしい",
        "meaning": "frightening"
      },
      {
        "char": "値",
        "level": "N3",
        "word": "値段",
        "reading": "ねだん",
        "meaning": "price"
      },
      {
        "char": "暗",
        "level": "N3",
        "word": "暗い",
        "reading": "くらい",
        "meaning": "dark"
      },
      {
        "char": "積",
        "level": "N3",
        "word": "積もる",
        "reading": "つもる",
        "meaning": "accumulate"
      },
      {
        "char": "夢",
        "level": "N3",
        "word": "夢",
        "reading": "ゆめ",
        "meaning": "dream"
      },
      {
        "char": "痛",
        "level": "N3",
        "word": "痛い",
        "reading": "いたい",
        "meaning": "painful"
      },
      {
        "char": "富",
        "level": "N3",
        "word": "豊富",
        "reading": "ほうふ",
        "meaning": "abundant"
      },
      {
        "char": "刻",
        "level": "N3",
        "word": "遅刻",
        "reading": "ちこく",
        "meaning": "lateness"
      },
      {
        "char": "鳴",
        "level": "N3",
        "word": "鳴る",
        "reading": "なる",
        "meaning": "ring or sound"
      },
      {
        "char": "欲",
        "level": "N3",
        "word": "欲しい",
        "reading": "ほしい",
        "meaning": "wanted"
      }
    ]
  },
  {
    "day": 25,
    "range": "541-567",
    "kanji": [
      {
        "char": "途",
        "level": "N3",
        "word": "途中",
        "reading": "とちゅう",
        "meaning": "on the way"
      },
      {
        "char": "曲",
        "level": "N3",
        "word": "曲がる",
        "reading": "まがる",
        "meaning": "turn or bend"
      },
      {
        "char": "耳",
        "level": "N3",
        "word": "耳",
        "reading": "みみ",
        "meaning": "ear"
      },
      {
        "char": "完",
        "level": "N3",
        "word": "完成",
        "reading": "かんせい",
        "meaning": "completion"
      },
      {
        "char": "願",
        "level": "N3",
        "word": "願う",
        "reading": "ねがう",
        "meaning": "wish or request"
      },
      {
        "char": "罪",
        "level": "N3",
        "word": "犯罪",
        "reading": "はんざい",
        "meaning": "crime"
      },
      {
        "char": "陽",
        "level": "N3",
        "word": "太陽",
        "reading": "たいよう",
        "meaning": "sun"
      },
      {
        "char": "亡",
        "level": "N3",
        "word": "亡くなる",
        "reading": "なくなる",
        "meaning": "pass away"
      },
      {
        "char": "散",
        "level": "N3",
        "word": "散歩",
        "reading": "さんぽ",
        "meaning": "walk or stroll"
      },
      {
        "char": "掛",
        "level": "N3",
        "word": "掛ける",
        "reading": "かける",
        "meaning": "hang or put on"
      },
      {
        "char": "昨",
        "level": "N3",
        "word": "昨日",
        "reading": "きのう",
        "meaning": "yesterday"
      },
      {
        "char": "怒",
        "level": "N3",
        "word": "怒る",
        "reading": "おこる",
        "meaning": "get angry"
      },
      {
        "char": "留",
        "level": "N3",
        "word": "留学",
        "reading": "りゅうがく",
        "meaning": "study abroad"
      },
      {
        "char": "礼",
        "level": "N3",
        "word": "失礼",
        "reading": "しつれい",
        "meaning": "rudeness or excuse me"
      },
      {
        "char": "列",
        "level": "N3",
        "word": "列",
        "reading": "れつ",
        "meaning": "queue or row"
      },
      {
        "char": "雪",
        "level": "N3",
        "word": "雪",
        "reading": "ゆき",
        "meaning": "snow"
      },
      {
        "char": "払",
        "level": "N3",
        "word": "払う",
        "reading": "はらう",
        "meaning": "pay"
      },
      {
        "char": "給",
        "level": "N3",
        "word": "給料",
        "reading": "きゅうりょう",
        "meaning": "salary"
      },
      {
        "char": "敗",
        "level": "N3",
        "word": "敗れる",
        "reading": "やぶれる",
        "meaning": "be defeated"
      },
      {
        "char": "捕",
        "level": "N3",
        "word": "捕まえる",
        "reading": "つかまえる",
        "meaning": "catch"
      },
      {
        "char": "忘",
        "level": "N3",
        "word": "忘れる",
        "reading": "わすれる",
        "meaning": "forget"
      },
      {
        "char": "晴",
        "level": "N3",
        "word": "晴れる",
        "reading": "はれる",
        "meaning": "clear up in weather"
      },
      {
        "char": "因",
        "level": "N3",
        "word": "要因",
        "reading": "よういん",
        "meaning": "factor or cause"
      },
      {
        "char": "折",
        "level": "N3",
        "word": "折る",
        "reading": "おる",
        "meaning": "fold or break"
      },
      {
        "char": "迎",
        "level": "N3",
        "word": "迎える",
        "reading": "むかえる",
        "meaning": "welcome or go to meet"
      },
      {
        "char": "悲",
        "level": "N3",
        "word": "悲しい",
        "reading": "かなしい",
        "meaning": "sad"
      },
      {
        "char": "港",
        "level": "N3",
        "word": "空港",
        "reading": "くうこう",
        "meaning": "airport"
      }
    ]
  },
  {
    "day": 26,
    "range": "568-593",
    "kanji": [
      {
        "char": "責",
        "level": "N3",
        "word": "責任",
        "reading": "せきにん",
        "meaning": "responsibility"
      },
      {
        "char": "除",
        "level": "N3",
        "word": "除く",
        "reading": "のぞく",
        "meaning": "exclude"
      },
      {
        "char": "困",
        "level": "N3",
        "word": "困る",
        "reading": "こまる",
        "meaning": "be in difficulty"
      },
      {
        "char": "閉",
        "level": "N3",
        "word": "閉める",
        "reading": "しめる",
        "meaning": "close something"
      },
      {
        "char": "吸",
        "level": "N3",
        "word": "吸う",
        "reading": "すう",
        "meaning": "breathe in or smoke"
      },
      {
        "char": "髪",
        "level": "N3",
        "word": "髪",
        "reading": "かみ",
        "meaning": "hair on the head"
      },
      {
        "char": "束",
        "level": "N3",
        "word": "束",
        "reading": "たば",
        "meaning": "bundle"
      },
      {
        "char": "眠",
        "level": "N3",
        "word": "眠い",
        "reading": "ねむい",
        "meaning": "sleepy"
      },
      {
        "char": "易",
        "level": "N3",
        "word": "容易",
        "reading": "ようい",
        "meaning": "easy or simple"
      },
      {
        "char": "窓",
        "level": "N3",
        "word": "窓",
        "reading": "まど",
        "meaning": "window"
      },
      {
        "char": "祖",
        "level": "N3",
        "word": "祖母",
        "reading": "そぼ",
        "meaning": "my grandmother"
      },
      {
        "char": "勤",
        "level": "N3",
        "word": "通勤",
        "reading": "つうきん",
        "meaning": "commuting to work"
      },
      {
        "char": "昔",
        "level": "N3",
        "word": "昔",
        "reading": "むかし",
        "meaning": "long ago"
      },
      {
        "char": "便",
        "level": "N3",
        "word": "便利",
        "reading": "べんり",
        "meaning": "convenient"
      },
      {
        "char": "適",
        "level": "N3",
        "word": "適当",
        "reading": "てきとう",
        "meaning": "suitable or careless depending on context"
      },
      {
        "char": "吹",
        "level": "N3",
        "word": "吹く",
        "reading": "ふく",
        "meaning": "blow"
      },
      {
        "char": "候",
        "level": "N3",
        "word": "天候",
        "reading": "てんこう",
        "meaning": "weather conditions"
      },
      {
        "char": "怖",
        "level": "N3",
        "word": "怖い",
        "reading": "こわい",
        "meaning": "scary"
      },
      {
        "char": "辞",
        "level": "N3",
        "word": "辞書",
        "reading": "じしょ",
        "meaning": "dictionary"
      },
      {
        "char": "否",
        "level": "N3",
        "word": "否定",
        "reading": "ひてい",
        "meaning": "denial or negation"
      },
      {
        "char": "遅",
        "level": "N3",
        "word": "遅い",
        "reading": "おそい",
        "meaning": "late or slow"
      },
      {
        "char": "煙",
        "level": "N3",
        "word": "煙",
        "reading": "けむり",
        "meaning": "smoke"
      },
      {
        "char": "徒",
        "level": "N3",
        "word": "生徒",
        "reading": "せいと",
        "meaning": "pupil"
      },
      {
        "char": "欠",
        "level": "N3",
        "word": "欠席",
        "reading": "けっせき",
        "meaning": "absence"
      },
      {
        "char": "迷",
        "level": "N3",
        "word": "迷う",
        "reading": "まよう",
        "meaning": "be lost or hesitate"
      },
      {
        "char": "洗",
        "level": "N3",
        "word": "洗う",
        "reading": "あらう",
        "meaning": "wash"
      }
    ]
  },
  {
    "day": 27,
    "range": "594-620",
    "kanji": [
      {
        "char": "互",
        "level": "N3",
        "word": "お互い",
        "reading": "おたがい",
        "meaning": "each other"
      },
      {
        "char": "才",
        "level": "N3",
        "word": "才能",
        "reading": "さいのう",
        "meaning": "talent"
      },
      {
        "char": "更",
        "level": "N3",
        "word": "変更",
        "reading": "へんこう",
        "meaning": "change or alteration"
      },
      {
        "char": "歯",
        "level": "N3",
        "word": "歯",
        "reading": "は",
        "meaning": "tooth"
      },
      {
        "char": "盗",
        "level": "N3",
        "word": "盗む",
        "reading": "ぬすむ",
        "meaning": "steal"
      },
      {
        "char": "慣",
        "level": "N3",
        "word": "慣れる",
        "reading": "なれる",
        "meaning": "get used to"
      },
      {
        "char": "晩",
        "level": "N3",
        "word": "今晩",
        "reading": "こんばん",
        "meaning": "this evening"
      },
      {
        "char": "箱",
        "level": "N3",
        "word": "箱",
        "reading": "はこ",
        "meaning": "box"
      },
      {
        "char": "到",
        "level": "N3",
        "word": "到着",
        "reading": "とうちゃく",
        "meaning": "arrival"
      },
      {
        "char": "頂",
        "level": "N3",
        "word": "頂く",
        "reading": "いただく",
        "meaning": "receive or eat humbly"
      },
      {
        "char": "杯",
        "level": "N3",
        "word": "一杯",
        "reading": "いっぱい",
        "meaning": "one cup or full"
      },
      {
        "char": "皆",
        "level": "N3",
        "word": "皆さん",
        "reading": "みなさん",
        "meaning": "everyone"
      },
      {
        "char": "招",
        "level": "N3",
        "word": "招待",
        "reading": "しょうたい",
        "meaning": "invitation"
      },
      {
        "char": "寒",
        "level": "N3",
        "word": "寒い",
        "reading": "さむい",
        "meaning": "cold weather"
      },
      {
        "char": "恥",
        "level": "N3",
        "word": "恥ずかしい",
        "reading": "はずかしい",
        "meaning": "embarrassed"
      },
      {
        "char": "疲",
        "level": "N3",
        "word": "疲れる",
        "reading": "つかれる",
        "meaning": "get tired"
      },
      {
        "char": "貧",
        "level": "N3",
        "word": "貧しい",
        "reading": "まずしい",
        "meaning": "poor"
      },
      {
        "char": "猫",
        "level": "N3",
        "word": "猫",
        "reading": "ねこ",
        "meaning": "cat"
      },
      {
        "char": "誤",
        "level": "N3",
        "word": "誤る",
        "reading": "あやまる",
        "meaning": "make a mistake"
      },
      {
        "char": "努",
        "level": "N3",
        "word": "努力",
        "reading": "どりょく",
        "meaning": "effort"
      },
      {
        "char": "幾",
        "level": "N3",
        "word": "幾つ",
        "reading": "いくつ",
        "meaning": "how many or how old"
      },
      {
        "char": "賛",
        "level": "N3",
        "word": "賛成",
        "reading": "さんせい",
        "meaning": "agreement"
      },
      {
        "char": "偶",
        "level": "N3",
        "word": "偶然",
        "reading": "ぐうぜん",
        "meaning": "coincidence"
      },
      {
        "char": "忙",
        "level": "N3",
        "word": "忙しい",
        "reading": "いそがしい",
        "meaning": "busy"
      },
      {
        "char": "泳",
        "level": "N3",
        "word": "泳ぐ",
        "reading": "およぐ",
        "meaning": "swim"
      },
      {
        "char": "靴",
        "level": "N3",
        "word": "靴",
        "reading": "くつ",
        "meaning": "shoes"
      },
      {
        "char": "偉",
        "level": "N3",
        "word": "偉い",
        "reading": "えらい",
        "meaning": "admirable or important"
      }
    ]
  }
];
