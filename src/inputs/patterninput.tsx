import { Color, Player, TextBox } from "@tabletop-playground/api";
import { jsxInTTPG } from "jsx-in-ttpg";

export type JSXAttributes<T extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[T];

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
    color,
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
