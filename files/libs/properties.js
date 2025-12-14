"use strict"

// constants
const PAGE_WIDTH = 1280;
const PAGE_HEIGHT = 720;
const MAIN_WIN_LOCATION = "../../../main/index.html?202011091230";
const BOOK_WIN_LOCATION = "../books/book01/chapter01/index.html?202011091230";
const ACTIVITY_WIN_LOCATION = "../activities/activity01/unit01/index.html?202011091230";


const PLATFORM = {
    SAFARI: "Safari",
    CHROME: "Chrome",
    IOS_SAFARI: "iOS Safari",
    IOS_CHROME: "iOS Chrome",
    IOS_UNKNOWN: "iOS Unknown",
    ANDROID: "android",
}

const DEVICE = {
    DESKTOP: "Desktop",
    MOBILE: "Mobile"
}

const BROWSER = {
    SAFARI: "Safari",
    CHROME: "Chrome",
}

// enums
const ICON_SUBJECT_TYPE = {
    BOOK: "book",
    BULB: "bulb",
    CHESS: "chess",
    PENCIL: "pencil",
    QUESTION: "question",
    PHONE: "phone",
    POSTCARD: "postcard",
    CHECKBOX: "checkbox",
    VIDEO: "video",
    STAR: "star",
    STARS: "stars",
    GAMEPAD: "gamepad",
    SCOOTER_01: "scooter01",
    SCOOTER_02: "scooter02",
}

const BTN_TYPE = {
    SIZE_160X60: { w: 160, h: 60 },    
    SIZE_200X80: { w: 200, h: 80 },    
}


const DIALOGUE_BOX_POINTER = {
    BOTTOM: "bottom",
    BOTTOM_LEFT: "bottom-left",
    BOTTOM_RIGHT: "bottom-right",
    TOP: "top",
    TOP_LEFT: "top-left",
    TOP_RIGHT: "top-right",
    LEFT_BOTTOM: "left-bottom",
    LEFT_MIDDLE: "left-middle",
    LEFT_MIDDLE_BOTTOM: "left-middle-bottom",    
    LEFT_MIDDLE_TOP: "left-middle-top",
    LEFT_TOP: "left-top",         
    NONE: "none",         
}

const SHADOW_TYPE = {
    PANEL: "panel",
    ICON: "icon",
    BUTTON: "button",
}

const TEXT_COLOR = {
    DEFAULT: "#293332",
    RED: "#C6525D",
    PANEL_BLUE: "#0277BD",
    PANEL_LIGHT_BLUE: "#BAF0F5",
    PANEL_YELLOW: "#E1A900",
    PANEL_LIGHT_YELLOW: "#F2E4A4",
    PANEL_ORANGE: "#F46A3E",
    PANEL_LIGHT_ORANGE: "#FAD6B6",
    PANEL_GREEN: "#2E7D32",
    PANEL_LIGHT_GREEN: "#CDF8C3",
    PANEL_PURPLE: "#794873",
    PANEL_LIGHT_PURPLE: "#E1BECA",
    HEADER_LIGHT_YELLOW: "#FFF8E0",
}

const PANEL_COLOR = {    
    BLUE: "#0277BD",
    LIGHT_BLUE: "#BAF0F5",
    YELLOW: "#E1A900",
    LIGHT_YELLOW: "#F2E4A4",
    ORANGE: "#F46A3E",
    LIGHT_ORANGE: "#FAD6B6",
    GREEN: "#2E7D32",
    LIGHT_GREEN: "#CDF8C3",
    PURPLE: "#794873",
    LIGHT_PURPLE: "#E1BECA",    
}

const HEADER_COLOR = {    
    LIGHT_YELLOW: "#FFF8E0",
}

const INFO_TABLE_TYPE = {
    YI_XING: 0,
    ER_XING: 1
}

const PAGE_INDEX = {
    SPLASH_01: 0,
    OPENING_01: 1,
    ACTIVITY_01: 2,
    
};

const DESTINATION_INDEX = {
    BUDDHA_TOOTH_RELIC_TEMPLE: 0,
    SAGO_LANE: 1,    
    SRI_MARIAMMAN_TEMPLE: 2,
    MASJID_JAMAE_MOSQUE: 3,
    PAGODA_STREET: 4,    
};


const CHARACTER_TYPE = {    
    PLAYER: "player",    
    PLAYER_FEMALE: "player_01",    
    PLAYER_MALE: "player_02",    
    NPC_CAPTAIN: "npc_01",    
    NPC_CASKET_BOSS: "npc_02",    
    NPC_GROCERY_VENDOR: "npc_03",    
    NPC_MONK: "npc_04",    
    NPC_RED_HAT: "npc_05",    
    NONE: "none"
}

const BADGE_TYPE = {
    BADGE_01: "badge_01",
    BADGE_02: "badge_02",
    BADGE_03: "badge_03",
    BADGE_04: "badge_04",
    BADGE_05: "badge_05",
}

const CARD_TYPE = {
    CARD_01: "card_01",
    CARD_02: "card_02",
    CARD_03: "card_03",
}

const POWER_CARD = {
    SUPER: "super",
    HINT: "hint",
}

const SHOW_DEBUG_INFO = false;;

const ENABLE_INVENTORY = false;

const TEACHER_GENDER = "male";

const ENABLE_LOCATION = true;

const ENABLE_LOCATION_ON_ALL_PLATFORMS = false;

const INPUT_CANVAS_REF_WIDTH = 906;