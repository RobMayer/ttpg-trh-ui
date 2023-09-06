import { VerticalAlignment, TextJustification, HorizontalAlignment } from "@tabletop-playground/api";
import { jsxInTTPG, boxChild, JSXNode } from "jsx-in-ttpg";

const Modal = ({ onClose, children, buttons = [], title }: { onClose: () => void; children?: JSXNode; buttons?: JSXNode[]; title: string }) => {
    return (
        <border color={"r111f"}>
            <verticalbox valign={VerticalAlignment.Fill}>
                {boxChild(
                    0,
                    <border color={"r444"}>
                        <layout padding={4}>
                            <horizontalbox valign={VerticalAlignment.Center} gap={4}>
                                {boxChild(
                                    1,
                                    <text size={14} justify={TextJustification.Center}>
                                        » {title} «
                                    </text>
                                )}
                                <imagebutton onClick={onClose} url={"https://raw.githubusercontent.com/RobMayer/ttpg-trh-ui/main/hosted/icons/actions/close.png"} height={16} />
                            </horizontalbox>
                        </layout>
                    </border>
                )}
                {boxChild(1, children)}
                {buttons.length > 0 && (
                    <horizontalbox gap={4} halign={HorizontalAlignment.Fill}>
                        {...buttons.map((btn) => boxChild(1, btn))}
                    </horizontalbox>
                )}
            </verticalbox>
        </border>
    );
};

export default Modal;
