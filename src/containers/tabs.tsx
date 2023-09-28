import { Button, Color, Player, VerticalAlignment, WidgetSwitcher } from "@tabletop-playground/api";
import { JSXNode, RefObject, boxChild, jsxInTTPG, useRef } from "jsx-in-ttpg";

const CLR_ACTIVE = new Color(1, 0.5, 0.25, 1);
const CLR_INACTIVE = new Color(1, 1, 1, 1);

export const TabEntry = (props: { title: string; children?: JSXNode }) => {
    return props;
};

export const Tabs = ({
    children,
    titles,
    value = 0,
    onChange,
    titleGap,
    gap,
    handle,
}: {
    children?: JSXNode | JSXNode[];
    value?: number;
    titles: string[];
    onChange?: (v: number, p: Player) => void;
    gap?: number;
    titleGap?: number;
    handle?: RefObject<{ set: (n: number) => void }>;
}) => {
    const switcherRef = useRef<WidgetSwitcher>();

    const btnRefs = useRef<Button[]>([]);

    const theTitles = Array(Array.isArray(children) ? children.length : children ? 1 : 0)
        .fill(0)
        .map((e, i) => {
            return i > titles.length - 1 ? `Tab ${i + 1}` : titles[i];
        });

    if (handle) {
        handle.current = {
            set: (n: number) => {
                switcherRef.current?.setActiveIndex(n);
                btnRefs.current?.forEach((btn, i) => {
                    btn.setTextColor(i === n ? CLR_ACTIVE : CLR_INACTIVE);
                });
            },
        };
    }

    const handleChange = (idx: number, p: Player) => {
        switcherRef.current?.setActiveIndex(idx);
        onChange?.(idx, p);
        btnRefs.current?.forEach((btn, i) => {
            btn.setTextColor(i === idx ? CLR_ACTIVE : CLR_INACTIVE);
        });
    };

    return (
        <verticalbox gap={gap} valign={VerticalAlignment.Fill}>
            <horizontalbox gap={titleGap ?? gap}>
                {...theTitles.map((each, i) =>
                    boxChild(
                        1,
                        <button
                            color={i === value ? CLR_ACTIVE : CLR_INACTIVE}
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
