import { Button, Color, Player } from "@tabletop-playground/api";
import { RefObject, boxChild, jsxInTTPG, useRef } from "jsx-in-ttpg";

const CLR_ACTIVE = new Color(1, 0.5, 0.25, 1);
const CLR_INACTIVE = new Color(1, 1, 1, 1);

export const PickButtons = ({
    options,
    value = 0,
    onChange,
    gap,
    handle,
}: {
    value?: number;
    options: string[];
    onChange?: (v: number, p: Player) => void;
    gap?: number;
    handle?: RefObject<{ set: (n: number) => void }>;
}) => {
    const btnRefs = useRef<Button[]>([]);

    if (handle) {
        handle.current = {
            set: (n: number) => {
                btnRefs.current?.forEach((btn, i) => {
                    btn.setTextColor(i === n ? CLR_ACTIVE : CLR_INACTIVE);
                });
            },
        };
    }

    const handleChange = (idx: number, player: Player) => {
        onChange?.(idx, player);
        btnRefs.current?.forEach((btn, i) => {
            btn.setTextColor(i === idx ? CLR_ACTIVE : CLR_INACTIVE);
        });
    };

    return (
        <horizontalbox gap={gap}>
            {...options.map((each, i) =>
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
    );
};
