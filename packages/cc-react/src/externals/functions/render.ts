import { GLOBALS } from "../../internals/globals";
import { generate } from "../../internals/runtime/generate";
import { mountEvents } from "../../internals/runtime/mountEvents";
import { isReactElement } from "../../internals/functions/isReactElement";

export const render = (node: ReactNode, container: HTMLElement): ReactNode => {
    if (GLOBALS.NODE_CURRENT_ROOT === undefined) {
        GLOBALS.NODE_CURRENT_ROOT = node;
    }

    if (node?.component !== undefined) {
        GLOBALS.NODE_CURRENT = node;
        GLOBALS.ELEMENT_CURRENT_PARENT = container;
        const { children, props, tag } = node.component(node.props, ...node.children);
        node.children = children;
        node.props = props;
        node.tag = tag;
    }

    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];

        if (isReactElement(child)) {
            const childReact = child as ReactNode;
            const result = render(childReact, container);
            result.index = i;
            node.children[i] = result;
        }
    }

    if (node === GLOBALS.NODE_CURRENT_ROOT && GLOBALS._FIRST_TIME) {
        generate(node as ReactNodeGenerated, container);
        mountEvents(node as ReactNodeGenerated);
        GLOBALS._FIRST_TIME = false;
    }

    return node;
};
