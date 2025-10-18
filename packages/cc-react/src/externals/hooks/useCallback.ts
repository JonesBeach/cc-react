import { GLOBALS } from "../../internals/globals";
import { dependenciesMatch } from "../../internals/functions/dependenciesMatch";

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
