import { GLOBALS } from "../../internals/globals";
import { renderAgain } from "../../internals/runtime/renderAgain";

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
