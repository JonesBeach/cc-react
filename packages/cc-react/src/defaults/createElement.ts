import { GLOBALS } from "../internals/globals";

export const createElement = (tag: CreateElementProps["tag"], props: CreateElementProps["props"], ...children: CreateElementProps["children"]): ReactNode => {
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
};
