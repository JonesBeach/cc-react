// /////////////////
// //// GLOBALS ////
// /////////////////
const GLOBALS = {
    _FIRST_TIME: true as boolean,
    APP: undefined as JSX.Element | undefined,
    ELEMENT_CURRENT_PARENT: undefined as HTMLElement | undefined,
    NODE_CURRENT: undefined as ReactNode | undefined,
    NODE_CURRENT_ROOT: undefined as ReactNode | undefined,
    NODE_CURRENT_ROOT_ANCHOR: undefined as ReactNode | undefined,
    NODE_PREVIOUS_ROOT: undefined as ReactNode | undefined,
};

// ///////////////////
// //// FUNCTIONS ////
// ///////////////////
function isReactElement(arg: any): boolean {
    if (typeof arg !== "object") {
        return false;
    }

    const keys = Object.keys(arg);
    return keys.includes("children") && keys.includes("props");
}

function containsNodeOrIsNode(source: ReactNode, target: ReactNode): boolean {
    if (source.children.length > 0) {
        for (const child of source.children) {
            if (!isReactElement(child)) {
                continue;
            }

            const childReact = child as ReactNode;

            if (containsNodeOrIsNode(childReact, target)) {
                return true;
            }
        }
    }

    return source === target;
}

// TODO:
// create virtual DOM for current state
// create virtual DOM for updated state
// find parent nodes that are not equal, then re-render

// /////////////////
// //// RUNTIME ////
// /////////////////
const React = {
    createElement: (tag: CreateElementParams["tag"], props: CreateElementParams["props"], ...children: CreateElementParams["children"]): ReactNode => {
        const result: ReactNode = { _effects: [], _effectsCursor: 0, _states: [], _statesCursor: 0, props, children, index: 0, tag: "" };

        if (GLOBALS.APP === undefined) {
            GLOBALS.APP = tag;
        }

        if (typeof tag === "function") {
            result.component = tag;
        } else {
            result.tag = tag;
        }

        return result;
    },
};

const generate = (node: ReactNodeGenerated, container: HTMLElement) => {
    const el = document.createElement(node.tag);
    node.element = el; // scuffed code

    if (node.props !== null) {
        const entries = Object.entries(node.props);

        for (const [k, v] of entries) {
            (el as any)[k] = v;
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

        if (child?.toString() !== undefined) {
            el.append(child?.toString());
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

const renderAgain = (el: ReactNodeGenerated): void => {
    const result = containsNodeOrIsNode(GLOBALS.NODE_CURRENT_ROOT!, el);

    if (!result) {
        throw new Error("Unexpected error: the element should exist!");
    }

    GLOBALS.NODE_CURRENT = el;
    el._statesCursor = 0;

    if (el?.component !== undefined) {
        GLOBALS.NODE_CURRENT = el;
        const result = el.component(el.props, ...el.children);
        el.children = result.children;
        el.props = result.props;
        el.tag = result.tag;
    }

    for (let i = 0; i < el.children.length; i++) {
        const child = el.children[i];

        if (isReactElement(child)) {
            const childReact = child as ReactNodeGenerated;
            renderAgain(childReact);
        }
    }

    if (el === GLOBALS.NODE_CURRENT_ROOT_ANCHOR) {
        generate(el, (GLOBALS.NODE_CURRENT_ROOT_ANCHOR as ReactNodeGenerated).element.parentElement!);
        GLOBALS.NODE_CURRENT_ROOT_ANCHOR = undefined;
    }
};

// //////////////////
// //// EXPORTED ////
// //////////////////
export const render = (element: ReactNode, container: HTMLElement): ReactNode => {
    if (GLOBALS.NODE_CURRENT_ROOT === undefined) {
        GLOBALS.NODE_CURRENT_ROOT = element;
    }

    if (element?.component !== undefined) {
        GLOBALS.NODE_CURRENT = element;
        GLOBALS.ELEMENT_CURRENT_PARENT = container;
        const { children, props, tag } = element.component(element.props, ...element.children);
        element.children = children;
        element.props = props;
        element.tag = tag;
    }

    for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i];

        if (isReactElement(child)) {
            const childReact = child as ReactNode;
            const result = render(childReact, container);
            result.index = i;
            element.children[i] = result;
        }
    }

    if (element === GLOBALS.NODE_CURRENT_ROOT && GLOBALS._FIRST_TIME) {
        generate(element as ReactNodeGenerated, container);
        GLOBALS._FIRST_TIME = false;
    }

    return element;
};

export const useState = <T extends any>(defaultValue?: T): [T, (v: T) => T] => {
    const element = GLOBALS.NODE_CURRENT!;
    const cursor = element._statesCursor;
    element._states[cursor] = element._states[cursor] ?? defaultValue;
    element._statesCursor++;

    const state = element._states[cursor];

    const setState = (v: T) => {
        element._states[cursor] = v;
        GLOBALS.NODE_CURRENT_ROOT_ANCHOR = element;
        renderAgain(element as ReactNodeGenerated);
        return v;
    };

    return [state, setState];
};

export default React;
