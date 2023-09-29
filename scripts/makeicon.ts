import { icon } from "@fortawesome/fontawesome-svg-core";
import path from "path";
import sharp from "sharp";

const [theIcon, theFile] = process.argv.slice(2);

if (!theIcon || !theFile) {
    console.error("makeicon <icon> <file>");
    process.exit(-1);
}

const isCustom = theIcon.startsWith("trh");
const useHollow = process.argv.includes("--hollow");

const svg = isCustom
    ? path.resolve(`./customicons/${theIcon}.svg`)
    : Buffer.from(icon(require(useHollow ? "@fortawesome/sharp-regular-svg-icons" : "@fortawesome/sharp-solid-svg-icons")[theIcon], { styles: { color: "white" } }).html[0]);

sharp(svg)
    .resize({ width: 64, height: 64, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.resolve("hosted", "icons", `${theFile}.png`))
    .then(() => {
        console.log("done");
    })
    .catch((e) => console.error(e));
