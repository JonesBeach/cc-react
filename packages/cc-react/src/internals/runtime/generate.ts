import { isReactElement } from "../functions/isReactElement";
import { GLOBALS } from "../globals";

export const generate = (node: ReactNodeGenerated, container: HTMLElement) => {
    const el = document.createElement(node.tag);
    node.element = el; // scuffed code

    if (node.props !== null) {
        const entries = Object.entries(node.props);

        for (const [k, v] of entries) {
            (el as any)[k] = v;

            if (k === "ref" && v?.current === null) {
                const value = v as Partial<Reference>;
                value.current = el;
            }
        }
    }

    if (typeof node.children === "undefined") {
        return node;
    }

    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const isReact = isReactElement(child);

        if (isReact) {
            const childReact = child as ReactNodeGenerated;
            generate(childReact, el);
            continue;
        }

        if (child !== undefined) {
            el.append(child as any); // not toString to have the same bug as react
            continue;
        }
    }

    container.appendChild(el);

    if (GLOBALS.NODE_CURRENT_ROOT_ANCHOR === (node as ReactNodeGenerated)) {
        const replaceNode = container.childNodes[node.index];
        container.replaceChild(el, replaceNode);
    }

    return node;
};
