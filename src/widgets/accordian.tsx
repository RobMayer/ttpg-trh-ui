import { LayoutBox, HorizontalAlignment } from "@tabletop-playground/api";
import { JSXNode, useRef, jsxInTTPG } from "jsx-in-ttpg";

const Accordian = ({ children, title, isOpen = false, onToggle }: { children?: JSXNode; title: string; isOpen?: boolean; onToggle?: (v: boolean) => void }) => {
    const contentRef = useRef<LayoutBox>();

    return (
        <verticalbox gap={4} halign={HorizontalAlignment.Fill}>
            <border color={"r444"}>
                <checkbox
                    onChange={(t, player, state) => {
                        onToggle?.(state);
                        contentRef.current?.setVisible(state);
                    }}
                    checked={isOpen}
                >
                    {title}
                </checkbox>
            </border>
            <layout padding={{ top: 2, bottom: 2, left: 4, right: 4 }} ref={contentRef} hidden={!isOpen}>
                {children}
            </layout>
        </verticalbox>
    );
};

export default Accordian;
