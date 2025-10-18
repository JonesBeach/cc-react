import { GLOBALS } from "../globals";
import { generate } from "./generate";
import { mountEvents } from "./mountEvents";
import { isReactElement } from "../functions/isReactElement";
import { containsNodeOrIsNode } from "../functions/containsNodeOrIsNode";

export const renderAgain = (node: ReactNodeGenerated): void => {
    const result = containsNodeOrIsNode(GLOBALS.NODE_CURRENT_ROOT!, node);

    if (!result) {
        throw new Error("Unexpected error: the element should exist!");
    }

    GLOBALS.NODE_CURRENT = node;
    node._callbacksCursor = 0;
    node._effectsCursor = 0;
    node._memosCursor = 0;
    node._statesCursor = 0;

    if (node?.component !== undefined) {
        GLOBALS.NODE_CURRENT = node;
        const result = node.component(node.props, ...node.children);
        node.children = result.children;
        node.props = result.props;
        node.tag = result.tag;
    }

    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (isReactElement(child)) {
            const childReact = child as ReactNodeGenerated;
            renderAgain(childReact);
        }
    }

    if (node === GLOBALS.NODE_CURRENT_ROOT_ANCHOR) {
        generate(node, (GLOBALS.NODE_CURRENT_ROOT_ANCHOR as ReactNodeGenerated).element.parentElement!);
        mountEvents(node as ReactNodeGenerated);
        GLOBALS.NODE_CURRENT_ROOT_ANCHOR = undefined;
    }
};
