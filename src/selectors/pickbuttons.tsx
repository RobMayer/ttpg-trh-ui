import { Button, Color, HorizontalBox, Player } from "@tabletop-playground/api";
import { RefObject, boxChild, jsxInTTPG, parseColor, render, useRef } from "jsx-in-ttpg";

type IColor = Color | [number, number, number, number] | string;

const CLR_ACTIVE = new Color(1, 0.5, 0.25, 1);
const CLR_INACTIVE = new Color(1, 1, 1, 1);

export type PickButtonsRef = {
    setValue: (n: number) => void;
    getValue: () => number;
    setOptions: (v: string[]) => void;
    getCount: () => number;
    setEnabled: (v: boolean) => void;
    setVisible: (v: boolean) => void;
    isEnabled: () => boolean;
    isVisible: () => boolean;
    setActiveColor: (c: IColor) => void;
    setInactiveColor: (c: IColor) => void;
};

export type PickButtonsProps = {
    value?: number;
    options: string[];
    onChange?: (v: number, p: Player) => void;
    gap?: number;
    ref?: RefObject<PickButtonsRef>;
    activeColor?: IColor;
    inactiveColor?: IColor;
};

export const PickButtons = ({ options, value = 0, onChange, gap, ref, activeColor = CLR_ACTIVE, inactiveColor = CLR_INACTIVE }: PickButtonsProps) => {
    const wrapperRef = useRef<HorizontalBox>();
    const btnRefs = useRef<Button[]>([]);

    let aColorState: Color = parseColor(activeColor) ?? CLR_ACTIVE;
    let iColorState: Color = parseColor(inactiveColor) ?? CLR_INACTIVE;
    let valueState: number = value ?? 0;
    let optState = [...options];
    if (value > options.length - 1) {
        valueState = 0;
    }

    if (ref) {
        ref.current = {
            getValue: () => valueState,
            setValue: (n: number) => {
                if (n < options.length && n >= 0) {
                    valueState = n;
                    btnRefs.current?.forEach((btn, i) => {
                        btn.setTextColor(i === valueState ? aColorState : iColorState);
                    });
                }
            },
            getCount: () => btnRefs.current?.length ?? 0,
            setOptions: (opts: string[]) => {
                wrapperRef.current?.removeAllChildren();
                btnRefs.clear();
                optState = [...opts];
                if (valueState > optState.length - 1) {
                    valueState = 0;
                }
                optState.forEach((each, i) => {
                    wrapperRef.current?.addChild(
                        render(
                            <button
                                color={i === valueState ? aColorState : iColorState}
                                ref={(el) => {
                                    btnRefs.current?.push(el);
                                }}
                                onClick={(el, p) => {
                                    handleChange(i, p);
                                }}
                            >
                                {each}
                            </button>
                        ),
                        1
                    );
                });
            },
            setEnabled: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isEnabled: () => wrapperRef.current?.isEnabled() ?? true,
            setVisible: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isVisible: () => wrapperRef.current?.isVisible() ?? true,
            setActiveColor: (c: IColor) => {
                const v = parseColor(c);
                if (v) {
                    aColorState = v;
                    btnRefs.current?.forEach((each, i) => {
                        if (i === valueState) {
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
                        if (i !== valueState) {
                            each.setTextColor(iColorState);
                        }
                    });
                }
            },
        };
    }

    const handleChange = (idx: number, player: Player) => {
        onChange?.(idx, player);
        valueState = idx;
        btnRefs.current?.forEach((btn, i) => {
            btn.setTextColor(i === valueState ? parseColor(activeColor) ?? CLR_ACTIVE : parseColor(inactiveColor) ?? CLR_INACTIVE);
        });
    };

    return (
        <horizontalbox gap={gap} ref={wrapperRef}>
            {...optState.map((each, i) =>
                boxChild(
                    1,
                    <button
                        color={i === valueState ? parseColor(activeColor) ?? CLR_ACTIVE : parseColor(inactiveColor) ?? CLR_INACTIVE}
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
    );
};
