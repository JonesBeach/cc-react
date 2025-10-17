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

function dependenciesMatch(mount: FunctionLifecycle) {
    for (let i = 0; i < mount.depCurr.length; i++) {
        // there's something terribly wrong if the arrays are not the same length
        const currDependency = mount.depCurr[i];
        const previousDependency = mount.depPrev![i];

        if (currDependency !== previousDependency) {
            return false;
        }
    }

    return true;
}

function isReactElement(arg: any): boolean {
    if (typeof arg !== "object") {
        return false;
    }

    const keys = Object.keys(arg);
    return keys.includes("children") && keys.includes("props");
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
        const result: ReactNode = {
            _callbacks: [],
            _callbacksCursor: 0,
            _effects: [],
            _effectsCursor: 0,
            _memos: [],
            _memosCursor: 0,
            _refs: [],
            _refsCursor: 0,
            _states: [],
            _statesCursor: 0,
            props,
            children,
            index: 0,
            tag: "",
        };

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

const renderAgain = (node: ReactNodeGenerated): void => {
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

const mountEvents = (node: ReactNodeGenerated): void => {
    for (const child of node.children) {
        if (isReactElement(child)) {
            const childReact = child as ReactNodeGenerated;
            mountEvents(childReact);
        }
    }

    for (const effect of node._effects) {
        if (effect.depPrev !== undefined && dependenciesMatch(effect)) {
            continue;
        }

        if (effect.unmount) {
            effect.unmount();
        }

        effect.unmount = effect.func() ?? undefined;
    }
};

// //////////////////
// //// EXPORTED ////
// //////////////////
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

export const useCallback = (func: FunctionLifecycle<void>["func"], dependencies: any[]) => {
    const element = GLOBALS.NODE_CURRENT!;
    const cursor = element._callbacksCursor;

    if (element._callbacks[cursor] === undefined) {
        element._callbacks[cursor] = { depCurr: dependencies, func };
    } else {
        element._callbacks[cursor].depPrev = element._callbacks[cursor].depCurr;
        element._callbacks[cursor].depCurr = dependencies;

        if (dependenciesMatch(element._callbacks[cursor])) {
            return element._callbacks[cursor].func;
        }

        element._callbacks[cursor].func = func;
    }

    element._callbacksCursor++;
    return element._callbacks[cursor].func;
};

export const useEffect = (func: FunctionLifecycle["func"], dependencies: any[]) => {
    const element = GLOBALS.NODE_CURRENT!;
    const cursor = element._effectsCursor;

    if (element._effects[cursor] === undefined) {
        element._effects[cursor] = { depCurr: dependencies, func };
    } else {
        element._effects[cursor].depPrev = element._effects[cursor].depCurr;
        element._effects[cursor].depCurr = dependencies;
        element._effects[cursor].func = func;
    }

    element._effectsCursor++;
};

export const useMemo = <T extends any>(func: FunctionLifecycle<T>["func"], dependencies: any[]) => {
    const element = GLOBALS.NODE_CURRENT!;
    const cursor = element._memosCursor;

    if (element._memos[cursor] === undefined) {
        element._memos[cursor] = { depCurr: dependencies, func, value: func() };
    } else {
        element._memos[cursor].depPrev = element._memos[cursor].depCurr;
        element._memos[cursor].depCurr = dependencies;

        if (dependenciesMatch(element._memos[cursor])) {
            return element._memos[cursor].value;
        }

        element._memos[cursor].func = func;
        element._memos[cursor].value = func();
    }

    element._memosCursor++;
    return element._memos[cursor].value;
};

export const useRef = <T extends any>(defaultValue: T | null): { current: T } => {
    const element = GLOBALS.NODE_CURRENT!;
    const cursor = element._refsCursor;
    element._refs[cursor] = element._refs[cursor] ?? { current: defaultValue };
    element._refsCursor++;

    return element._refs[cursor];
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
