import { LayoutBox, HorizontalAlignment, CheckBox } from "@tabletop-playground/api";
import { JSXNode, useRef, jsxInTTPG, RefObject } from "jsx-in-ttpg";

type Handle = {
    open: () => void;
    close: () => void;
};

const Accordian = ({ children, title, isOpen = false, onToggle, handle }: { children?: JSXNode; title: string; isOpen?: boolean; onToggle?: (v: boolean) => void; handle?: RefObject<Handle> }) => {
    const contentRef = useRef<LayoutBox>();
    const switchRef = useRef<CheckBox>();

    if (handle) {
        handle.current = {
            open: () => {
                onToggle?.(true);
                switchRef.current?.setIsChecked(true);
                contentRef.current?.setVisible(true);
            },
            close: () => {
                onToggle?.(false);
                switchRef.current?.setIsChecked(false);
                contentRef.current?.setVisible(false);
            },
        };
    }

    return (
        <verticalbox gap={4} halign={HorizontalAlignment.Fill}>
            <border color={"r444"}>
                <checkbox
                    ref={switchRef}
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
