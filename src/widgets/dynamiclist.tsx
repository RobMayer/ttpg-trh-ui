import { VerticalAlignment, TextJustification, VerticalBox, HorizontalAlignment } from "@tabletop-playground/api";
import { jsxInTTPG, boxChild, useRef, JSXNode, render, RefObject } from "jsx-in-ttpg";

const Listable = ({
    title,
    populator,
    handle,
    buttonSize = 16,
    gap = 8,
    options = [],
    noRefresh = false,
}: {
    title: string;
    populator: () => JSXNode | JSXNode[];
    handle?: RefObject<{ refresh: () => void }>;
    buttonSize?: number;
    gap?: number;
    options?: JSXNode[];
    noRefresh?: boolean;
}) => {
    const listRef = useRef<VerticalBox>();

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
        };
    }

    if (!noRefresh) {
        options.push(<imagebutton height={buttonSize} url={"https://raw.githubusercontent.com/RobMayer/ttpg-trh-ui/main/hosted/icons/actions/refresh.png"} onClick={refresh} />);
    }

    return (
        <verticalbox gap={gap} valign={VerticalAlignment.Fill}>
            <horizontalbox valign={VerticalAlignment.Center}>
                {boxChild(1, <text justify={TextJustification.Center}>{title}</text>)}
                {options.length > 0 && (
                    <horizontalbox gap={1} halign={HorizontalAlignment.Fill}>
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

export default Listable;
