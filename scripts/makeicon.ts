import { icon } from "@fortawesome/fontawesome-svg-core";
import path from "path";
import sharp from "sharp";
import fs from "fs/promises";

type Icon = readonly [string, "solid" | "hollow" | "empty" | "trh"] | string;

const ICONS: { [key: string]: Icon } = {
    "actions/power": "PowerOff",
    "actions/refresh": "Refresh",
    "actions/close": "XmarkLarge",
    "actions/settings": "Gear",
    "actions/add": "Add",
    "actions/subtract": "Subtract",
    "actions/trash": "Trash",

    "media/play": "Play",
    "media/stop": "Stop",
    "media/pause": "Pause",
    "media/shuffle": "Shuffle",
    "media/no-shuffle": ["NoShuffle", "trh"],
    "media/no-repeat": ["NoRepeat", "trh"],
    "media/backward": "Backward",
    "media/forward": "Forward",
    "media/repeat": "Repeat",
    "media/repeat-once": "Repeat1",

    "window/maximize": "WindowMaximize",
    "window/minimize": "WindowMinimize",
    "window/expand": "UpRightFromSquare",
    "window/compress": ["ArrowDownLeftToSquare", "trh"],
    "window/restore": "WindowRestore",

    "arrows/maximize": "Maximize",
    "arrows/minimize": "Minimize",
    "arrows/caret-left": "CaretLeft",
    "arrows/caret-right": "CaretRight",
    "arrows/caret-up": "CaretUp",
    "arrows/caret-down": "CaretDown",

    "arrows/chevron-left": "ChevronLeft",
    "arrows/chevron-right": "ChevronRight",
    "arrows/chevron-up": "ChevronUp",
    "arrows/chevron-down": "ChevronDown",

    "arrows/arrow-left": "ArrowLeft",
    "arrows/arrow-right": "ArrowRight",
    "arrows/arrow-up": "ArrowUp",
    "arrows/arrow-down": "ArrowDown",

    "pips/circle": "Circle",
    "pips/circle-hollow": ["Circle", "hollow"],
    "pips/circle-empty": ["Circle", "empty"],

    "pips/diamond": "Diamond",
    "pips/diamond-hollow": ["Diamond", "hollow"],
    "pips/diamond-empty": ["Diamond", "empty"],

    "pips/shield": "Shield",
    "pips/shield-hollow": ["Shield", "hollow"],
    "pips/shield-empty": ["Shield", "empty"],

    "pips/crown": "Crown",
    "pips/crown-hollow": ["Crown", "hollow"],
    "pips/crown-empty": ["Crown", "empty"],

    "pips/hexagon": "Hexagon",
    "pips/hexagon-hollow": ["Hexagon", "hollow"],
    "pips/hexagon-empty": ["Hexagon", "empty"],

    "pips/flame": "FireFlameCurved",
    "pips/flame-hollow": ["FireFlameCurved", "hollow"],
    "pips/flame-empty": ["FireFlameCurved", "empty"],

    "pips/skull": "Skull",
    "pips/skull-hollow": ["Skull", "hollow"],
    "pips/skull-empty": ["Skull", "empty"],
} as const;

const BLACK_TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
const WHITE_TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const SIZE = 64;
const PADDING = 0;

const fName = (key: string) => path.resolve("hosted", "icons", `${key}.png`);

const doIcon = async (key: keyof typeof ICONS) => {
    const name = Array.isArray(ICONS[key]) ? ICONS[key][0] : ICONS[key];
    const type = Array.isArray(ICONS[key]) ? ICONS[key][1] : "solid";

    const fileName = fName(`${key}`);

    await fs.mkdir(path.dirname(fileName), { recursive: true });

    if (type === "hollow") {
        const lower = sharp(Buffer.from(icon(require("@fortawesome/sharp-solid-svg-icons")[`fa${name}`], { styles: { color: "#000c" } }).html[0]))
            .resize({ width: SIZE, height: SIZE, fit: "contain", background: BLACK_TRANSPARENT })
            .extend({ left: PADDING, right: PADDING, top: PADDING, bottom: PADDING, background: BLACK_TRANSPARENT })
            .png();
        const upper = sharp(Buffer.from(icon(require("@fortawesome/sharp-regular-svg-icons")[`fa${name}`], { styles: { color: "white" } }).html[0]))
            .resize({ width: SIZE, height: SIZE, fit: "contain", background: WHITE_TRANSPARENT })
            .extend({ left: PADDING, right: PADDING, top: PADDING, bottom: PADDING, background: WHITE_TRANSPARENT })
            .png();
        return sharp({
            create: {
                background: BLACK_TRANSPARENT,
                width: 64,
                height: 64,
                channels: 4,
            },
        })
            .composite([{ input: await lower.toBuffer() }, { input: await upper.toBuffer() }])
            .png()
            .toFile(fileName);
    }
    if (type === "empty") {
        return sharp(Buffer.from(icon(require("@fortawesome/sharp-regular-svg-icons")[`fa${name}`], { styles: { color: "white" } }).html[0]))
            .resize({ width: SIZE, height: SIZE, fit: "contain", background: WHITE_TRANSPARENT })
            .extend({ left: PADDING, right: PADDING, top: PADDING, bottom: PADDING, background: WHITE_TRANSPARENT })
            .png()
            .toFile(fileName);
    }
    if (type === "solid") {
        return sharp(Buffer.from(icon(require("@fortawesome/sharp-solid-svg-icons")[`fa${name}`], { styles: { color: "white" } }).html[0]))
            .resize({ width: SIZE, height: SIZE, fit: "contain", background: WHITE_TRANSPARENT })
            .extend({ left: PADDING, right: PADDING, top: PADDING, bottom: PADDING, background: WHITE_TRANSPARENT })
            .png()
            .toFile(fileName);
    }
    if (type === "trh") {
        return sharp(path.resolve(`./customicons/trh${name}.svg`))
            .resize({ width: SIZE, height: SIZE, fit: "contain", background: WHITE_TRANSPARENT })
            .extend({ left: PADDING, right: PADDING, top: PADDING, bottom: PADDING, background: WHITE_TRANSPARENT })
            .png()
            .toFile(fileName);
    }
};

Promise.all(Object.keys(ICONS).map(doIcon))
    .then(() => {
        console.log("done");
    })
    .catch((e) => {
        console.error(e);
    });

const snakeToPascal = (string: string) => {
    return lowerFirst(string.split("-").map(upperFirst).join(""));
};

const upperFirst = (string: string) => {
    return string.slice(0, 1).toUpperCase() + string.slice(1, string.length);
};

const lowerFirst = (string: string) => {
    return string.slice(0, 1).toLowerCase() + string.slice(1, string.length);
};
