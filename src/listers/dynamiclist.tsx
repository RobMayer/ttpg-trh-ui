import { VerticalAlignment, VerticalBox, Color } from "@tabletop-playground/api";
import { jsxInTTPG, useRef, JSXNode, render, RefObject, parseColor } from "jsx-in-ttpg";

type IColor = Color | [number, number, number, number] | string;

type Populator = () => JSXNode | JSXNode[];
export type DynamicListRef = {
    repopulate: () => void;
    setPopulator: (f: Populator) => void;
    setEnabled: (v: boolean) => void;
    isEnabled: () => boolean;
    setVisible: (v: boolean) => void;
    isVisible: () => void;
};

export type DynamicListProps = {
    populator: Populator;
    ref?: RefObject<DynamicListRef>;
    gap?: number;
    hidden?: boolean;
    disabled?: boolean;
};

export const DynamicList = ({ populator, ref, gap = 8, hidden = false, disabled = false }: DynamicListProps) => {
    const wrapperRef = useRef<VerticalBox>();
    const listRef = useRef<VerticalBox>();

    const repopulate = () => {
        listRef.current?.removeAllChildren();
        const c = populator();
        (Array.isArray(c) ? c : [c]).forEach((each) => {
            listRef.current?.addChild(render(each));
        });
    };

    if (ref) {
        ref.current = {
            repopulate,
            setPopulator: (f: () => JSXNode | JSXNode[], runImmediate?: boolean) => {
                populator = f;
                if (runImmediate) {
                    repopulate();
                }
            },
            setEnabled: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isEnabled: () => wrapperRef.current?.isEnabled() ?? true,
            setVisible: (n: boolean) => wrapperRef.current?.setEnabled(n),
            isVisible: () => wrapperRef.current?.isVisible() ?? true,
        };
    }

    // if (!noRefresh) {
    //     options.push(<imagebutton ref={refreshRef} height={buttonSize} url={"https://raw.githubusercontent.com/RobMayer/ttpg-trh-ui/main/hosted/icons/actions/refresh.png"} onClick={repopulate} />);
    // }

    return (
        <verticalbox gap={gap} ref={listRef} valign={VerticalAlignment.Fill} hidden={hidden} disabled={disabled}>
            {populator()}
        </verticalbox>
    );
};
