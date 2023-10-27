import { Card, Color, HorizontalBox, ImageButton, Player } from "@tabletop-playground/api";
import { RefObject, boxChild, jsxInTTPG, parseColor, render, useRef } from "jsx-in-ttpg";

type IColor = Color | [number, number, number, number] | string;

const CLR_ACTIVE = new Color(1, 0.5, 0.25, 1);
const CLR_INACTIVE = new Color(1, 1, 1, 1);

type ImageParams =
    | {
          url: string;
      }
    | {
          src: string;
          srcPakage?: string;
      }
    | {
          card: Card;
      };

export type PickImagesRef = {
    setValue: (n: number) => void;
    getValue: () => number;
    setOptions: (v: ImageParams[]) => void;
    getCount: () => number;
    setEnabled: (v: boolean) => void;
    setVisible: (v: boolean) => void;
    isEnabled: () => boolean;
    isVisible: () => boolean;
    setActiveColor: (c: IColor) => void;
    setInactiveColor: (c: IColor) => void;
    getActiveColor: (c: IColor) => void;
    getInactiveColor: (c: IColor) => void;
};

export type PickImagesProps = {
    value?: number;
    options: ImageParams[];
    onChange?: (v: number, p: Player) => void;
    gap?: number;
    ref?: RefObject<PickImagesRef>;
    activeColor?: IColor;
    inactiveColor?: IColor;
};

export const PickImages = ({ options, value = 0, onChange, gap, ref, activeColor = CLR_ACTIVE, inactiveColor = CLR_INACTIVE }: PickImagesProps) => {
    const wrapperRef = useRef<HorizontalBox>();

    let aColorState: Color = parseColor(activeColor) ?? CLR_ACTIVE;
    let iColorState: Color = parseColor(inactiveColor) ?? CLR_INACTIVE;
    let valueState: number = value ?? 0;
    let optState = [...options];
    if (value > options.length - 1) {
        valueState = 0;
    }

    const btnRefs = useRef<ImageButton[]>([]);

    if (ref) {
        ref.current = {
            getValue: () => value,
            setValue: (n: number) => {
                if (n < options.length && n >= 0) {
                    valueState = n;
                    btnRefs.current?.forEach((btn, i) => {
                        btn.setTintColor(i === valueState ? aColorState : iColorState);
                    });
                }
            },
            getCount: () => btnRefs.current?.length ?? 0,
            setOptions: (opts: ImageParams[]) => {
                wrapperRef.current?.removeAllChildren();
                btnRefs.clear();
                optState = [...opts];
                if (valueState > optState.length - 1) {
                    valueState = 0;
                }
                optState.forEach((each, i) => {
                    wrapperRef.current?.addChild(
                        render(
                            <imagebutton
                                color={i === valueState ? aColorState : iColorState}
                                ref={(el) => {
                                    btnRefs.current?.push(el);
                                }}
                                onClick={(el, p) => {
                                    handleChange(i, p);
                                }}
                                {...each}
                            />
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
                            each.setTintColor(aColorState);
                        }
                    });
                }
            },
            getActiveColor: () => new Color(aColorState.r, aColorState.g, aColorState.b, aColorState.a),
            setInactiveColor: (c: IColor) => {
                const v = parseColor(c);
                if (v) {
                    iColorState = v;
                    btnRefs.current?.forEach((each, i) => {
                        if (i !== valueState) {
                            each.setTintColor(iColorState);
                        }
                    });
                }
            },
            getInactiveColor: () => new Color(iColorState.r, iColorState.g, iColorState.b, iColorState.a),
        };
    }

    const handleChange = (idx: number, p: Player) => {
        onChange?.(idx, p);
        valueState = idx;
        btnRefs.current?.forEach((btn, i) => {
            btn.setTintColor(i === valueState ? aColorState : iColorState);
        });
    };

    return (
        <horizontalbox gap={gap} ref={wrapperRef}>
            {...optState.map((each, i) =>
                boxChild(
                    1,
                    <imagebutton
                        color={i === valueState ? aColorState : iColorState}
                        ref={(el) => {
                            btnRefs.current?.push(el);
                        }}
                        onClick={(el, p) => {
                            handleChange(i, p);
                        }}
                        {...each}
                    />
                )
            )}
        </horizontalbox>
    );
};
