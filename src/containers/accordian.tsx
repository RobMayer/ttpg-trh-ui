import { LayoutBox, HorizontalAlignment, CheckBox, VerticalAlignment, VerticalBox, Color, Border, HorizontalBox } from "@tabletop-playground/api";
import { JSXNode, useRef, jsxInTTPG, RefObject, boxChild, parseColor, render } from "jsx-in-ttpg";

type IColor = Color | [number, number, number, number] | string;

export type AccordianRef = {
    open: () => void;
    close: () => void;
    toggle: () => void;
    isOpen: () => void;
    setAccentColor: (color: IColor) => void;
    setTitle: (v: string) => void;
    getTitle: () => string;
    setEnabled: (v: boolean) => void;
    isEnabled: () => boolean;
    setVisible: (v: boolean) => void;
    isVisible: () => void;
    setMenu: (opts: JSXNode | JSXNode[] | null) => void;
};

export type AccordianProps = {
    children?: JSXNode;
    title: string;
    isOpen?: boolean;
    onToggle?: (v: boolean) => void;
    ref?: RefObject<AccordianRef>;
    menu?: JSXNode | JSXNode[];
    disabled?: boolean;
    hidden?: boolean;
    accentColor?: IColor;
};

export const Accordian = ({ children, title, isOpen = false, onToggle, ref, menu = [], disabled = false, hidden = false, accentColor = "r444" }: AccordianProps) => {
    const wrapperRef = useRef<VerticalBox>();
    const accentRef = useRef<Border>();
    const contentRef = useRef<LayoutBox>();
    const menuRef = useRef<HorizontalBox>();
    const switchRef = useRef<CheckBox>();

    let aColorState: Color = parseColor(accentColor) ?? parseColor("r444")!;
    let menuState: JSXNode[] = Array.isArray(menu) ? [...menu] : [menu];

    if (ref) {
        ref.current = {
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
            toggle: () => {
                if (contentRef.current) {
                    const isOpen = contentRef.current.isVisible();
                    onToggle?.(!isOpen);
                    switchRef.current?.setIsChecked(!isOpen);
                    contentRef.current?.setVisible(!isOpen);
                }
            },
            setAccentColor: (t: IColor) => {
                const v = parseColor(aColorState);
                if (v) {
                    accentRef.current?.setColor(aColorState);
                }
            },
            isOpen: () => contentRef.current?.isVisible() ?? true,
            setEnabled: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isEnabled: () => wrapperRef.current?.isEnabled() ?? true,
            setVisible: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isVisible: () => wrapperRef.current?.isVisible() ?? true,
            setTitle: (v: string) => {
                switchRef.current?.setText(v);
            },
            getTitle: () => switchRef.current?.getText() ?? "",
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
        <verticalbox valign={VerticalAlignment.Fill} ref={wrapperRef} disabled={disabled} hidden={hidden}>
            <border color={aColorState} ref={accentRef}>
                <horizontalbox valign={VerticalAlignment.Center}>
                    {boxChild(
                        1,
                        <verticalbox>
                            <checkbox
                                ref={switchRef}
                                onChange={(t, player, state) => {
                                    onToggle?.(state);
                                    contentRef.current?.setVisible(state);
                                }}
                                checked={isOpen}
                                label={title}
                            />
                        </verticalbox>
                    )}
                    <horizontalbox gap={1} ref={menuRef} halign={HorizontalAlignment.Fill} hidden={menuState.length === 0}>
                        {...menuState.map((opt) => boxChild(1, opt))}
                    </horizontalbox>
                </horizontalbox>
            </border>
            <layout padding={{ top: 2, bottom: 2, left: 4, right: 4 }} ref={contentRef} hidden={!isOpen}>
                {children}
            </layout>
        </verticalbox>
    );
};
