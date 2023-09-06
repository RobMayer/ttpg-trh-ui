import { IconParams, icon } from "@fortawesome/fontawesome-svg-core";
import path from "path";
import sharp from "sharp";

const [theIcon, theFile] = process.argv.slice(2);

if (!theIcon || !theFile) {
    console.error("makeicon <icon> <file>");
    process.exit(-1);
}
const bit = require("@fortawesome/sharp-solid-svg-icons")[theIcon];
if (!bit) {
    console.error(`invalid icon ${theIcon}`);
    process.exit(-1);
}

const svg = icon(bit, {
    styles: { color: "white" },
}).html[0];

sharp(Buffer.from(svg))
    .resize({ width: 64, height: 64, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.resolve("hosted", "icons", `${theFile}.png`))
    .then(() => {
        console.log("done");
    })
    .catch((e) => console.error(e));
