import { isReactElement } from "../functions/isReactElement";
import { dependenciesMatch } from "../functions/dependenciesMatch";

export const mountEvents = (node: ReactNodeGenerated): void => {
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
