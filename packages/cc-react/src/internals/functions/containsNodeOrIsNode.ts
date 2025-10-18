import { isReactElement } from "./isReactElement";

export function containsNodeOrIsNode(source: ReactNode, target: ReactNode): boolean {
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
