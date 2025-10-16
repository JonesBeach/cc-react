// /////////////////
// //// GLOBALS ////
// /////////////////
const GLOBALS = {
    _FIRST_TIME: true,
    APP: undefined,
    ELEMENT_CURRENT_PARENT: undefined,
    NODE_CURRENT: undefined,
    NODE_CURRENT_ROOT: undefined,
    NODE_CURRENT_ROOT_ANCHOR: undefined,
    NODE_PREVIOUS_ROOT: undefined,
};
// ///////////////////
// //// FUNCTIONS ////
// ///////////////////
function isReactElement(arg) {
    if (typeof arg !== "object") {
        return false;
    }
    const keys = Object.keys(arg);
    return keys.includes("children") && keys.includes("props");
}
function containsNodeOrIsNode(source, target) {
    if (source.children.length > 0) {
        for (const child of source.children) {
            if (!isReactElement(child)) {
                continue;
            }
            const childReact = child;
            if (containsNodeOrIsNode(childReact, target)) {
                return true;
            }
        }
    }
    return source === target;
}
function dependenciesMatch(mount) {
    for (let i = 0; i < mount.dependenciesCurrent.length; i++) {
        // there's something terribly wrong if the arrays are not the same length
        const currDependency = mount.dependenciesCurrent[i];
        const previousDependency = mount.dependenciesPrevious[i];
        if (currDependency !== previousDependency) {
            return false;
        }
    }
    return true;
}
// TODO:
// create virtual DOM for current state
// create virtual DOM for updated state
// find parent nodes that are not equal, then re-render
// /////////////////
// //// RUNTIME ////
// /////////////////
const React = {
    createElement: (tag, props, ...children) => {
        const result = { _effects: [], _effectsCursor: 0, _states: [], _statesCursor: 0, props, children, index: 0, tag: "" };
        if (GLOBALS.APP === undefined) {
            GLOBALS.APP = tag;
        }
        if (typeof tag === "function") {
            result.component = tag;
        }
        else {
            result.tag = tag;
        }
        return result;
    },
};
const generate = (node, container) => {
    const el = document.createElement(node.tag);
    node.element = el; // scuffed code
    if (node.props !== null) {
        const entries = Object.entries(node.props);
        for (const [k, v] of entries) {
            el[k] = v;
        }
    }
    if (typeof node.children === "undefined") {
        return node;
    }
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        const isReact = isReactElement(child);
        if (isReact) {
            const childReact = child;
            generate(childReact, el);
            continue;
        }
        if (child !== undefined) {
            el.append(child); // not toString to have the same bug as react
            continue;
        }
    }
    container.appendChild(el);
    if (GLOBALS.NODE_CURRENT_ROOT_ANCHOR === node) {
        const replaceNode = container.childNodes[node.index];
        container.replaceChild(el, replaceNode);
    }
    return node;
};
const renderAgain = (node) => {
    const result = containsNodeOrIsNode(GLOBALS.NODE_CURRENT_ROOT, node);
    if (!result) {
        throw new Error("Unexpected error: the element should exist!");
    }
    GLOBALS.NODE_CURRENT = node;
    node._statesCursor = 0;
    node._effectsCursor = 0;
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
            const childReact = child;
            renderAgain(childReact);
        }
    }
    if (node === GLOBALS.NODE_CURRENT_ROOT_ANCHOR) {
        generate(node, GLOBALS.NODE_CURRENT_ROOT_ANCHOR.element.parentElement);
        mountEvents(node);
        GLOBALS.NODE_CURRENT_ROOT_ANCHOR = undefined;
    }
};
const mountEvents = (node) => {
    for (const child of node.children) {
        if (isReactElement(child)) {
            const childReact = child;
            mountEvents(childReact);
        }
    }
    for (const effect of node._effects) {
        if (effect.dependenciesPrevious !== undefined && dependenciesMatch(effect)) {
            continue;
        }
        if (effect.unmount) {
            effect.unmount();
        }
        effect.unmount = effect.mount() ?? undefined;
    }
};
// //////////////////
// //// EXPORTED ////
// //////////////////
export const render = (node, container) => {
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
            const childReact = child;
            const result = render(childReact, container);
            result.index = i;
            node.children[i] = result;
        }
    }
    if (node === GLOBALS.NODE_CURRENT_ROOT && GLOBALS._FIRST_TIME) {
        generate(node, container);
        mountEvents(node);
        GLOBALS._FIRST_TIME = false;
    }
    return node;
};
export const useState = (defaultValue) => {
    const element = GLOBALS.NODE_CURRENT;
    const cursor = element._statesCursor;
    element._states[cursor] = element._states[cursor] ?? defaultValue;
    element._statesCursor++;
    const state = element._states[cursor];
    const setState = (v) => {
        element._states[cursor] = v;
        GLOBALS.NODE_CURRENT_ROOT_ANCHOR = element;
        renderAgain(element);
        return v;
    };
    return [state, setState];
};
export const useEffect = (mount, dependencies) => {
    const element = GLOBALS.NODE_CURRENT;
    const cursor = element._effectsCursor;
    if (element._effects[cursor] === undefined) {
        element._effects[cursor] = { dependenciesCurrent: dependencies, mount };
    }
    else {
        element._effects[cursor].dependenciesPrevious = element._effects[cursor].dependenciesCurrent;
        element._effects[cursor].dependenciesCurrent = dependencies;
        element._effects[cursor].mount = mount;
    }
    element._effectsCursor++;
};
export default React;
