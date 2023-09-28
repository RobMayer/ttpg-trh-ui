import { VerticalAlignment, TextJustification, VerticalBox, HorizontalAlignment, ImageButton, HorizontalBox } from "@tabletop-playground/api";
import { jsxInTTPG, boxChild, useRef, JSXNode, render, RefObject } from "jsx-in-ttpg";

type Populator = () => JSXNode | JSXNode[];
type Handle = {
    refresh: () => void;
    setPopulator: (f: Populator) => void;
};

export const DynamicList = ({
    title,
    populator,
    handle,
    buttonSize = 16,
    gap = 8,
    options = [],
    noRefresh = false,
}: {
    title: string;
    populator: Populator;
    handle?: RefObject<Handle>;
    buttonSize?: number;
    gap?: number;
    options?: JSXNode[];
    noRefresh?: boolean;
}) => {
    const listRef = useRef<VerticalBox>();
    const refreshRef = useRef<ImageButton>();
    const optionsRef = useRef<HorizontalBox>();

    const refresh = () => {
        listRef.current?.removeAllChildren();
        const c = populator();
        (Array.isArray(c) ? c : [c]).forEach((each) => {
            listRef.current?.addChild(render(each));
        });
    };

    if (handle) {
        handle.current = {
            refresh,
            setPopulator: (f: () => JSXNode | JSXNode[]) => {
                populator = f;
            },
        };
    }

    if (!noRefresh) {
        options.push(<imagebutton ref={refreshRef} height={buttonSize} url={"https://raw.githubusercontent.com/RobMayer/ttpg-trh-ui/main/hosted/icons/actions/refresh.png"} onClick={refresh} />);
    }

    return (
        <verticalbox gap={gap} valign={VerticalAlignment.Fill}>
            <horizontalbox valign={VerticalAlignment.Center}>
                {boxChild(1, <text justify={TextJustification.Center}>{title}</text>)}
                {options.length > 0 && (
                    <horizontalbox gap={1} ref={optionsRef} halign={HorizontalAlignment.Fill}>
                        {...options.map((btn) => boxChild(1, btn))}
                    </horizontalbox>
                )}
            </horizontalbox>
            {boxChild(
                1,
                <border color={"r181818"}>
                    <verticalbox gap={gap} ref={listRef} valign={VerticalAlignment.Fill}>
                        {populator()}
                    </verticalbox>
                </border>
            )}
        </verticalbox>
    );
};
