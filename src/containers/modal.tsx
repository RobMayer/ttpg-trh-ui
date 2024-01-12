import { VerticalAlignment, TextJustification, HorizontalAlignment, Color, Border, HorizontalBox } from "@tabletop-playground/api";
import { jsxInTTPG, boxChild, JSXNode, RefObject, parseColor, useRef, render } from "jsx-in-ttpg";

type IColor = Color | [number, number, number, number] | string;

const CLOSE_BUTTON = "https://raw.githubusercontent.com/RobMayer/ttpg-trh-icons/main/hosted/actions/close.png";

export type ModalRef = {
    close: () => void;
    setEnabled: (v: boolean) => void;
    isEnabled: () => boolean;
    setBackgroundColor: (color: IColor) => void;
    setAccentColor: (color: IColor) => void;
    setTitle: (value: string) => void;
    setMenu: (opts: JSXNode | JSXNode[] | null) => void;
    setFooter: (opts: JSXNode | JSXNode[] | null) => void;
};

export type ModalProps = {
    children?: JSXNode;
    onClose: () => void;
    footer?: JSXNode | JSXNode[];
    menu?: JSXNode | JSXNode[];
    backgroundColor?: IColor;
    accentColor?: IColor;
    title?: string | JSXNode;
    ref?: RefObject<ModalRef>;
    disabled?: boolean;
};

export const Modal = ({ onClose, children, footer = [], menu = [], title, ref, backgroundColor = "r111", accentColor = "r444", disabled = false }: ModalProps) => {
    const wrapperRef = useRef<Border>();
    const titlebarRef = useRef<Border>();
    const titleRef = useRef<HorizontalBox>();
    const menuRef = useRef<HorizontalBox>();
    const footerRef = useRef<HorizontalBox>();

    let aColorState: Color = parseColor(accentColor) ?? parseColor("r444")!;
    let bColorState: Color = parseColor(backgroundColor) ?? parseColor("r111")!;
    let menuState: JSXNode[] = Array.isArray(menu) ? [...menu] : [menu];
    let footerState: JSXNode[] = Array.isArray(footer) ? [...footer] : [footer];

    if (ref) {
        ref.current = {
            close: () => {
                onClose();
            },
            setEnabled: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isEnabled: () => wrapperRef.current?.isEnabled() ?? true,
            setBackgroundColor: (t: IColor) => {
                const v = parseColor(t);
                if (v) {
                    bColorState = v;
                    wrapperRef.current?.setColor(bColorState);
                }
            },
            setAccentColor: (t: IColor) => {
                const v = parseColor(t);
                if (v) {
                    aColorState = v;
                    wrapperRef.current?.setColor(aColorState);
                }
            },
            setTitle: (t: string | JSXNode | null) => {
                titleRef.current?.removeChildAt(0);
                titleRef.current?.insertChild(render(typeof t === "string" ? <text justify={TextJustification.Center}>» {t} «</text> : t), 0, 1);
            },
            setMenu: (opts: JSXNode | JSXNode[] | null) => {
                opts = opts ?? [];
                menuState = Array.isArray(opts) ? [...opts] : [opts];

                if (menuRef.current) {
                    menuRef.current?.removeAllChildren();
                    [...menuState, <imagebutton onClick={onClose} url={CLOSE_BUTTON} height={16} />].forEach((each, i) => {
                        menuRef.current?.addChild(render(each), 1);
                    });
                }
            },
            setFooter: (opts: JSXNode | JSXNode[] | null) => {
                opts = opts ?? [];
                footerState = Array.isArray(opts) ? [...opts] : [opts];

                if (footerRef.current) {
                    footerRef.current?.removeAllChildren();
                    footerRef.current?.setVisible(footerState.length > 0);
                    footerState.forEach((each, i) => {
                        footerRef.current?.addChild(render(each), 1);
                    });
                }
            },
        };
    }

    return (
        <border color={bColorState} ref={wrapperRef} disabled={disabled}>
            <verticalbox valign={VerticalAlignment.Fill}>
                <border color={aColorState} ref={titlebarRef}>
                    <layout padding={4}>
                        <horizontalbox valign={VerticalAlignment.Center} gap={4} ref={titleRef}>
                            {boxChild(1, typeof title === "string" ? <text justify={TextJustification.Center}> » {title} « </text> : title)}
                            <horizontalbox gap={4} halign={HorizontalAlignment.Fill} valign={VerticalAlignment.Center} ref={menuRef}>
                                {[...menuState, <imagebutton onClick={onClose} url={CLOSE_BUTTON} height={16} />].map((opt) => boxChild(1, opt))}
                            </horizontalbox>
                        </horizontalbox>
                    </layout>
                </border>
                {boxChild(1, children)}
                <horizontalbox gap={4} halign={HorizontalAlignment.Fill} valign={VerticalAlignment.Center} hidden={footerState.length === 0} ref={footerRef}>
                    {...footerState.map((btn) => boxChild(1, btn))}
                </horizontalbox>
            </verticalbox>
        </border>
    );
};
