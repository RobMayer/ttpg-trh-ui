import { VerticalAlignment, TextJustification, VerticalBox } from "@tabletop-playground/api";
import { jsxInTTPG, boxChild, useRef, JSXNode, render, RefObject } from "jsx-in-ttpg";

const Listable = ({
    title,
    populator,
    handle,
    buttonSize,
    gap = 8,
}: {
    title: string;
    populator: () => JSXNode | JSXNode[];
    handle?: RefObject<{ refresh: () => void }>;
    buttonSize?: number;
    gap?: number;
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

    return (
        <verticalbox gap={gap} valign={VerticalAlignment.Fill}>
            <horizontalbox valign={VerticalAlignment.Center}>
                {boxChild(1, <text justify={TextJustification.Center}>{title}</text>)}
                <imagebutton height={buttonSize} url={"https://raw.githubusercontent.com/RobMayer/ttpg-trh-ui/main/hosted/icons/actions/refresh.png"} onClick={refresh} />
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
