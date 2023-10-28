import { Border, Color, HorizontalAlignment, HorizontalBox, Text, TextJustification, VerticalAlignment, VerticalBox } from "@tabletop-playground/api";
import { JSXNode, RefObject, boxChild, jsxInTTPG, parseColor, render, useRef } from "jsx-in-ttpg";

type IColor = Color | [number, number, number, number] | string;

export type FrameRef = {
    setEnabled: (v: boolean) => void;
    isEnabled: () => boolean;
    setVisible: (v: boolean) => void;
    isVisible: () => void;
    setAccentColor: (c: IColor) => void;
    setBackgroundColor: (c: IColor) => void;
    setTitle: (t: string | JSXNode | null) => void;
    setMenu: (opts: JSXNode | JSXNode[] | null) => void;
};

export type FrameProps = {
    title: string | JSXNode;
    menu?: JSXNode | JSXNode[];
    gap?: number;
    ref?: RefObject<FrameRef>;
    accentColor?: IColor;
    backgroundColor?: IColor;
    hidden?: boolean;
    disabled?: boolean;
    children?: JSXNode;
};

export const Frame = ({ title, ref, gap = 8, menu = [], accentColor = "r0000", backgroundColor = "r181818", disabled = false, hidden = false, children }: FrameProps) => {
    const wrapperRef = useRef<Border>();
    const titlebarRef = useRef<Border>();
    const titleRef = useRef<HorizontalBox>();
    const menuRef = useRef<HorizontalBox>();

    let menuState: JSXNode[] = Array.isArray(menu) ? [...menu] : [menu];

    if (ref) {
        ref.current = {
            setEnabled: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isEnabled: () => wrapperRef.current?.isEnabled() ?? true,
            setVisible: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isVisible: () => wrapperRef.current?.isVisible() ?? true,
            setAccentColor: (c: IColor) => {
                const v = parseColor(c);
                if (v) {
                    titlebarRef.current?.setColor(v);
                }
            },
            setBackgroundColor: (c: IColor) => {
                const v = parseColor(c);
                if (v) {
                    wrapperRef.current?.setColor(v);
                }
            },
            setTitle: (t: string | JSXNode | null) => {
                titleRef.current?.removeChildAt(0);
                titleRef.current?.insertChild(render(typeof t === "string" ? <text justify={TextJustification.Center}>{t}</text> : t), 0, 1);
            },
            setMenu: (opts: JSXNode | JSXNode[] | null) => {
                opts = opts ?? [];
                menuState = Array.isArray(opts) ? [...opts] : [opts];
                menuRef.current?.removeAllChildren();
                menuRef.current?.setVisible(menuState.length > 0);
                menuState.forEach((each, i) => {
                    menuRef.current?.addChild(render(each), 1);
                });
            },
        };
    }

    return (
        <border ref={wrapperRef} color={backgroundColor} hidden={hidden} disabled={disabled}>
            <verticalbox gap={gap} valign={VerticalAlignment.Fill}>
                <border ref={titlebarRef} color={accentColor}>
                    <horizontalbox valign={VerticalAlignment.Center} ref={titleRef}>
                        {boxChild(1, typeof title === "string" ? <text justify={TextJustification.Center}>{title}</text> : title)}
                        <horizontalbox gap={1} ref={menuRef} halign={HorizontalAlignment.Fill} hidden={menuState.length === 0}>
                            {...menuState.map((opt) => boxChild(1, opt))}
                        </horizontalbox>
                    </horizontalbox>
                </border>
                {boxChild(1, children ?? null)}
            </verticalbox>
        </border>
    );
};
