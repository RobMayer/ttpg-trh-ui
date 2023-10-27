import { Color, Player, TextBox } from "@tabletop-playground/api";
import { jsxInTTPG, parseColor } from "jsx-in-ttpg";

export type JSXAttributes<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];

const INVALID_COLOR = new Color(1, 0, 0, 1);
const COLOR = new Color(1, 1, 1, 1);

export type PatternInputProps = Omit<JSXAttributes<"input">, "type"> & {
    pattern: RegExp;
    onValidChange?: (el: TextBox, p: Player, v: string) => void;
    onValidChangeActual?: (el: TextBox, p: Player | undefined, v: string) => void;
    onValidCommit?: (el: TextBox, p: Player, v: string, hard: boolean) => void;
    onValidCommitActual?: (el: TextBox, p: Player | undefined, v: string, hard: boolean) => void;
    onInvalidChange?: (el: TextBox, p: Player, v: string) => void;
    onInvalidChangeActual?: (el: TextBox, p: Player | undefined, v: string) => void;
    onInvalidCommit?: (el: TextBox, p: Player, v: string, hard: boolean) => void;
    onInvalidCommitActual?: (el: TextBox, p: Player | undefined, v: string, hard: boolean) => void;
    invalidColor?: Color | [number, number, number, number] | string;
};

export const PatternInput = ({
    pattern,
    onValidChange,
    onValidChangeActual,
    onValidCommit,
    onValidCommitActual,
    onInvalidChange,
    onInvalidChangeActual,
    onInvalidCommit,
    onInvalidCommitActual,
    onChange,
    onChangeActual,
    onCommit,
    onCommitActual,
    value,
    invalidColor = "rf00f",
    color = "rffff",
    maxLength,
    ...props
}: PatternInputProps) => {
    const startsValid = pattern.test(value ?? "");

    return (
        <input
            {...props}
            value={value}
            maxLength={maxLength}
            color={startsValid ? invalidColor : color}
            onChangeActual={(el, p, v) => {
                const isValid = pattern.test(v);
                el.setTextColor(isValid ? parseColor(color) ?? COLOR : parseColor(invalidColor) ?? INVALID_COLOR);
                if (isValid) {
                    if (p !== undefined) {
                        onValidChange?.(el, p, v);
                    }
                    onValidChangeActual?.(el, p, v);
                } else {
                    if (p !== undefined) {
                        onInvalidChange?.(el, p, v);
                    }
                    onInvalidChangeActual?.(el, p, v);
                }
                if (p !== undefined) {
                    onChange?.(el, p, v);
                }
                onChangeActual?.(el, p, v);
            }}
            onCommitActual={(el, p, v, hard) => {
                const isValid = pattern.test(v);
                el.setTextColor(isValid ? parseColor(color) ?? COLOR : parseColor(invalidColor) ?? INVALID_COLOR);
                if (isValid) {
                    if (p !== undefined) {
                        onValidCommit?.(el, p, v, hard);
                    }
                    onValidCommitActual?.(el, p, v, hard);
                } else {
                    if (p !== undefined) {
                        onInvalidCommit?.(el, p, v, hard);
                    }
                    onInvalidCommitActual?.(el, p, v, hard);
                }
                if (p !== undefined) {
                    onCommit?.(el, p, v, hard);
                }
                onCommitActual?.(el, p, v, hard);
            }}
        />
    );
};
