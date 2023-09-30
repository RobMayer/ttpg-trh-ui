import { Color, Player, TextBox } from "@tabletop-playground/api";
import { jsxInTTPG, parseColor } from "jsx-in-ttpg";

export type JSXAttributes<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];

const INVALID_COLOR = new Color(1, 0, 0, 1);
const COLOR = new Color(1, 1, 1, 1);

export const PatternInput = ({
    pattern,
    onValidChange,
    onValidChangeActual,
    onValidCommit,
    onValidCommitActual,
    onChange,
    onChangeActual,
    onCommit,
    onCommitActual,
    value,
    invalidColor = "rf00f",
    color = "rffff",
    maxLength,
    ...props
}: JSXAttributes<"input"> & {
    pattern: RegExp;
    onValidChange?: (el: TextBox, p: Player, v: string) => void;
    onValidChangeActual?: (el: TextBox, p: Player | undefined, v: string) => void;
    onValidCommit?: (el: TextBox, p: Player, v: string, hard: boolean) => void;
    onValidCommitActual?: (el: TextBox, p: Player | undefined, v: string, hard: boolean) => void;
    invalidColor?: Color | [number, number, number, number] | string;
}) => {
    const startsValid = pattern.test(value ?? "");

    return (
        <input
            {...props}
            value={value}
            maxLength={maxLength}
            color={startsValid ? invalidColor : color}
            onChange={(el, p, v) => {
                const isValid = pattern.test(v);
                if (isValid) {
                    onValidChange?.(el, p, v);
                }
                onChange?.(el, p, v);
            }}
            onChangeActual={(el, p, v) => {
                const isValid = pattern.test(v);
                if (isValid) {
                    onValidChangeActual?.(el, p, v);
                }
                el.setTextColor(isValid ? parseColor(color) ?? COLOR : parseColor(invalidColor) ?? INVALID_COLOR);
                onValidChangeActual?.(el, p, v);
            }}
            onCommit={(el, p, v, hard) => {
                const isValid = pattern.test(v);
                if (isValid) {
                    onValidCommit?.(el, p, v, hard);
                }
                onCommit?.(el, p, v, hard);
            }}
            onCommitActual={(el, p, v, hard) => {
                const isValid = pattern.test(v);
                if (isValid) {
                    onValidCommitActual?.(el, p, v, hard);
                }
                onCommitActual?.(el, p, v, hard);
            }}
        />
    );
};
