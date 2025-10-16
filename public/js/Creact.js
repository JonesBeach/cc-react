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
        if (child?.toString() !== undefined) {
            el.append(child?.toString());
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
const renderAgain = (el) => {
    const result = containsNodeOrIsNode(GLOBALS.NODE_CURRENT_ROOT, el);
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
            const childReact = child;
            renderAgain(childReact);
        }
    }
    if (el === GLOBALS.NODE_CURRENT_ROOT_ANCHOR) {
        generate(el, GLOBALS.NODE_CURRENT_ROOT_ANCHOR.element.parentElement);
        GLOBALS.NODE_CURRENT_ROOT_ANCHOR = undefined;
    }
};
// //////////////////
// //// EXPORTED ////
// //////////////////
export const render = (element, container) => {
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
            const childReact = child;
            const result = render(childReact, container);
            result.index = i;
            element.children[i] = result;
        }
    }
    if (element === GLOBALS.NODE_CURRENT_ROOT && GLOBALS._FIRST_TIME) {
        generate(element, container);
        GLOBALS._FIRST_TIME = false;
    }
    return element;
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
export default React;
