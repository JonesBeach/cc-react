import { GLOBALS } from "../../internals/globals";
import { dependenciesMatch } from "../../internals/functions/dependenciesMatch";

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
