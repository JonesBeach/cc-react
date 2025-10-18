import React, { useCallback, useEffect, useMemo, useRef, useState } from "cc-react";
import Bottom from "./Bottom.tsx";

const TextInput = () => {
    const [text, setText] = useState("default");
    const [bool, setBool] = useState(true);
    const el = useRef<HTMLElement>(null);

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

    return (
        <div>
            <Bottom type={text} />
            <button ref={el} onclick={onclick1}>
                {text}
            </button>
            <button onclick={onclick2}>{bool}</button>
            <input type="text" value={text} />
        </div>
    );
};

export default TextInput;
