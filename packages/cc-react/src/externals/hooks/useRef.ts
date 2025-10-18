import { GLOBALS } from "../../internals/globals";

export const useRef = <T extends any>(defaultValue: T | null): { current: T } => {
    const element = GLOBALS.NODE_CURRENT!;
    const cursor = element._refsCursor;
    element._refs[cursor] = element._refs[cursor] ?? { current: defaultValue };
    element._refsCursor++;

    return element._refs[cursor];
};
