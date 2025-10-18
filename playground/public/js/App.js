"use strict";
(() => {
  // ../packages/cc-react/dist/internals/globals.js
  var GLOBALS = {
    _FIRST_TIME: true,
    APP: void 0,
    ELEMENT_CURRENT_PARENT: void 0,
    NODE_CURRENT: void 0,
    NODE_CURRENT_ROOT: void 0,
    NODE_CURRENT_ROOT_ANCHOR: void 0,
    NODE_PREVIOUS_ROOT: void 0
  };

  // ../packages/cc-react/dist/defaults/createElement.js
  var createElement = (tag, props, ...children) => {
    const result = {
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
      tag: ""
    };
    if (GLOBALS.APP === void 0) {
      GLOBALS.APP = tag;
    }
    if (typeof tag === "function") {
      result.component = tag;
    } else {
      result.tag = tag;
    }
    return result;
  };

  // ../packages/cc-react/dist/defaults/index.js
  var React = {
    createElement
  };
  var defaults_default = React;

  // ../packages/cc-react/dist/internals/functions/isReactElement.js
  function isReactElement(arg) {
    if (typeof arg !== "object") {
      return false;
    }
    const keys = Object.keys(arg);
    return keys.includes("children") && keys.includes("props");
  }

  // ../packages/cc-react/dist/internals/runtime/generate.js
  var generate = (node, container) => {
    const el = document.createElement(node.tag);
    node.element = el;
    if (node.props !== null) {
      const entries = Object.entries(node.props);
      for (const [k, v] of entries) {
        el[k] = v;
        if (k === "ref" && v?.current === null) {
          const value = v;
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
        const childReact = child;
        generate(childReact, el);
        continue;
      }
      if (child !== void 0) {
        el.append(child);
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

  // ../packages/cc-react/dist/internals/functions/dependenciesMatch.js
  function dependenciesMatch(mount) {
    for (let i = 0; i < mount.depCurr.length; i++) {
      const currDependency = mount.depCurr[i];
      const previousDependency = mount.depPrev[i];
      if (currDependency !== previousDependency) {
        return false;
      }
    }
    return true;
  }

  // ../packages/cc-react/dist/internals/runtime/mountEvents.js
  var mountEvents = (node) => {
    for (const child of node.children) {
      if (isReactElement(child)) {
        const childReact = child;
        mountEvents(childReact);
      }
    }
    for (const effect of node._effects) {
      if (effect.depPrev !== void 0 && dependenciesMatch(effect)) {
        continue;
      }
      if (effect.unmount) {
        effect.unmount();
      }
      effect.unmount = effect.func() ?? void 0;
    }
  };

  // ../packages/cc-react/dist/externals/functions/render.js
  var render = (node, container) => {
    if (GLOBALS.NODE_CURRENT_ROOT === void 0) {
      GLOBALS.NODE_CURRENT_ROOT = node;
    }
    if (node?.component !== void 0) {
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

  // ../packages/cc-react/dist/externals/hooks/useCallback.js
  var useCallback = (func, dependencies) => {
    const element = GLOBALS.NODE_CURRENT;
    const cursor = element._callbacksCursor;
    if (element._callbacks[cursor] === void 0) {
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

  // ../packages/cc-react/dist/externals/hooks/useEffect.js
  var useEffect = (func, dependencies) => {
    const element = GLOBALS.NODE_CURRENT;
    const cursor = element._effectsCursor;
    if (element._effects[cursor] === void 0) {
      element._effects[cursor] = { depCurr: dependencies, func };
    } else {
      element._effects[cursor].depPrev = element._effects[cursor].depCurr;
      element._effects[cursor].depCurr = dependencies;
      element._effects[cursor].func = func;
    }
    element._effectsCursor++;
  };

  // ../packages/cc-react/dist/externals/hooks/useMemo.js
  var useMemo = (func, dependencies) => {
    const element = GLOBALS.NODE_CURRENT;
    const cursor = element._memosCursor;
    if (element._memos[cursor] === void 0) {
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

  // ../packages/cc-react/dist/externals/hooks/useRef.js
  var useRef = (defaultValue) => {
    const element = GLOBALS.NODE_CURRENT;
    const cursor = element._refsCursor;
    element._refs[cursor] = element._refs[cursor] ?? { current: defaultValue };
    element._refsCursor++;
    return element._refs[cursor];
  };

  // ../packages/cc-react/dist/internals/functions/containsNodeOrIsNode.js
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

  // ../packages/cc-react/dist/internals/runtime/renderAgain.js
  var renderAgain = (node) => {
    const result = containsNodeOrIsNode(GLOBALS.NODE_CURRENT_ROOT, node);
    if (!result) {
      throw new Error("Unexpected error: the element should exist!");
    }
    GLOBALS.NODE_CURRENT = node;
    node._callbacksCursor = 0;
    node._effectsCursor = 0;
    node._memosCursor = 0;
    node._statesCursor = 0;
    if (node?.component !== void 0) {
      GLOBALS.NODE_CURRENT = node;
      const result2 = node.component(node.props, ...node.children);
      node.children = result2.children;
      node.props = result2.props;
      node.tag = result2.tag;
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
      GLOBALS.NODE_CURRENT_ROOT_ANCHOR = void 0;
    }
  };

  // ../packages/cc-react/dist/externals/hooks/useState.js
  var useState = (defaultValue) => {
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

  // ../packages/cc-react/dist/index.js
  var dist_default = defaults_default;

  // dist/client/components/Bottom.js
  var Bottom = ({ type }) => {
    console.log("render", "Bottom");
    return dist_default.createElement("div", { class: type }, "Bottoms");
  };
  var Bottom_default = Bottom;

  // dist/client/components/Inner.js
  var Inner = ({ background }) => {
    console.log("render", "Inner");
    return dist_default.createElement(
      "div",
      null,
      dist_default.createElement("div", null, "Inner")
    );
  };
  var Inner_default = Inner;

  // dist/client/components/Container.js
  var Container = () => {
    console.log("render", "Container");
    return dist_default.createElement(
      "div",
      null,
      dist_default.createElement("p", null, "Container:"),
      dist_default.createElement(Inner_default, { background: "true" })
    );
  };
  var Container_default = Container;

  // dist/client/components/TextInput.js
  var TextInput = () => {
    const [text, setText] = useState("default");
    const [bool, setBool] = useState(true);
    const el = useRef(null);
    console.log("render", "TextInput", text, bool);
    const onclick1 = () => {
      setText(text + "1");
    };
    const onclick2 = () => {
      setBool(!bool);
    };
    const memo = useMemo(() => text, [bool]);
    const callback = useCallback(() => {
      console.log("callback", bool);
    }, [bool]);
    useEffect(() => {
      console.log("effect", "TextInput", bool);
      console.log("ref", "TextInput", el);
      callback();
      return () => {
        console.log("unmounting", "TextInput", bool);
      };
    }, [bool]);
    console.log("memo", memo);
    console.log("ref outside", el);
    return dist_default.createElement(
      "div",
      null,
      dist_default.createElement(Bottom_default, { type: text }),
      dist_default.createElement("button", { ref: el, onclick: onclick1 }, text),
      dist_default.createElement("button", { onclick: onclick2 }, bool),
      dist_default.createElement("input", { type: "text", value: text })
    );
  };
  var TextInput_default = TextInput;

  // dist/client/App.js
  var App = ({ environment }) => {
    const [first, setFirst] = useState("app");
    const test = "ewrwer" + first;
    console.log("render", "App");
    return dist_default.createElement(
      "div",
      { draggable: true },
      dist_default.createElement(
        "p",
        null,
        "I am a ",
        test
      ),
      dist_default.createElement(TextInput_default, null),
      dist_default.createElement(Container_default, null),
      dist_default.createElement(Bottom_default, { type: "s" }),
      dist_default.createElement(Bottom_default, { type: "s" }),
      dist_default.createElement(TextInput_default, null),
      dist_default.createElement(Bottom_default, { type: "s" }),
      dist_default.createElement(Bottom_default, { type: "s" }),
      dist_default.createElement(Bottom_default, { type: "s" })
    );
  };
  render(dist_default.createElement(App, { environment: "dev" }), document.getElementById("myapp"));
})();
