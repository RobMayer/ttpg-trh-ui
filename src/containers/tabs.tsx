import { Button, Color, HorizontalBox, Player, VerticalAlignment, VerticalBox, WidgetSwitcher } from "@tabletop-playground/api";
import { JSXNode, RefObject, boxChild, jsxInTTPG, parseColor, render, useRef } from "jsx-in-ttpg";

type IColor = Color | [number, number, number, number] | string;

const CLR_ACTIVE = new Color(1, 0.5, 0.25, 1);
const CLR_INACTIVE = new Color(1, 1, 1, 1);

export type TabsRef = {
    getActive: () => number;
    setActive: (n: number) => void;
    getCount: () => number;
    setEnabled: (v: boolean) => void;
    isEnabled: () => boolean;
    setVisible: (v: boolean) => void;
    isVisible: () => void;
    setTabs: (opts: { [key: string]: JSXNode }) => void;
    setActiveColor: (c: IColor) => void;
    setInactiveColor: (c: IColor) => void;
};

export type TabsProps = {
    children?: JSXNode | JSXNode[];
    value?: number;
    titles: string[];
    onChange?: (v: number, p: Player) => void;
    gap?: number;
    buttonGap?: number;
    hidden?: boolean;
    disabled?: boolean;
    ref?: RefObject<TabsRef>;
    activeColor?: IColor;
    inactiveColor?: IColor;
};

export const Tabs = ({ children, titles, value = 0, onChange, buttonGap, gap, ref, activeColor = CLR_ACTIVE, inactiveColor = CLR_INACTIVE, hidden, disabled }: TabsProps) => {
    const wrapperRef = useRef<VerticalBox>();
    const switcherRef = useRef<WidgetSwitcher>();
    const btnRefs = useRef<Button[]>([]);
    const buttonListRef = useRef<HorizontalBox>();
    let aColorState: Color = parseColor(activeColor) ?? CLR_ACTIVE;
    let iColorState: Color = parseColor(inactiveColor) ?? CLR_INACTIVE;

    let titleState = Array(Array.isArray(children) ? children.length : children ? 1 : 0)
        .fill(0)
        .map((e, i) => {
            return i > titles.length - 1 ? `Tab ${i + 1}` : titles[i];
        });

    if (ref) {
        ref.current = {
            getActive: () => switcherRef.current?.getActiveIndex() ?? 0,
            setActive: (n: number) => {
                switcherRef.current?.setActiveIndex(n);
                btnRefs.current?.forEach((btn, i) => {
                    btn.setTextColor(i === n ? aColorState : iColorState);
                });
            },
            getCount: () => switcherRef.current?.getNumChildren() ?? 0,
            setEnabled: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isEnabled: () => wrapperRef.current?.isEnabled() ?? true,
            setVisible: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isVisible: () => wrapperRef.current?.isVisible() ?? true,
            setTabs: (opts: { [key: string]: JSXNode }, newVal?: number) => {
                let nV = newVal ?? switcherRef.current?.getActiveIndex() ?? 0;
                titleState = Object.keys(opts);
                if (nV < 0 || nV >= titleState.length) {
                    nV = 0;
                }

                buttonListRef.current?.removeAllChildren();
                switcherRef.current?.removeAllChildren();
                btnRefs.clear();
                titleState.map((k, i) => {
                    buttonListRef.current?.addChild(
                        render(
                            <button
                                color={i === nV ? aColorState : iColorState}
                                ref={(el) => {
                                    btnRefs.current?.push(el);
                                }}
                                onClick={(el, p) => {
                                    handleChange(i, p);
                                }}
                            >
                                {k}
                            </button>
                        )
                    );
                    switcherRef.current?.addChild(render(opts[k]));
                });
                switcherRef.current?.setActiveIndex(nV);
            },
            setActiveColor: (c: IColor) => {
                const v = parseColor(c);
                if (v) {
                    aColorState = v;
                    btnRefs.current?.forEach((each, i) => {
                        if (i === switcherRef.current?.getActiveIndex()) {
                            each.setTextColor(aColorState);
                        }
                    });
                }
            },
            setInactiveColor: (c: IColor) => {
                const v = parseColor(c);
                if (v) {
                    iColorState = v;
                    btnRefs.current?.forEach((each, i) => {
                        if (i !== switcherRef.current?.getActiveIndex()) {
                            each.setTextColor(iColorState);
                        }
                    });
                }
            },
        };
    }

    const handleChange = (idx: number, p: Player) => {
        switcherRef.current?.setActiveIndex(idx);
        onChange?.(idx, p);
        btnRefs.current?.forEach((btn, i) => {
            btn.setTextColor(i === idx ? aColorState : iColorState);
        });
    };

    return (
        <verticalbox gap={gap} valign={VerticalAlignment.Fill} ref={wrapperRef}>
            <horizontalbox gap={buttonGap ?? gap} ref={buttonListRef}>
                {...titleState.map((each, i) =>
                    boxChild(
                        1,
                        <button
                            color={i === value ? aColorState : iColorState}
                            ref={(el) => {
                                btnRefs.current?.push(el);
                            }}
                            onClick={(el, p) => {
                                handleChange(i, p);
                            }}
                        >
                            {each}
                        </button>
                    )
                )}
            </horizontalbox>
            {boxChild(
                1,
                <switch value={value ?? 0} ref={switcherRef}>
                    {children}
                </switch>
            )}
        </verticalbox>
    );
};
