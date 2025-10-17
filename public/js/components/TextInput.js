import React, { useCallback, useEffect, useMemo, useRef, useState } from "../Creact.js";
import Bottom from "./Bottom.js";
const TextInput = () => {
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
    return (React.createElement("div", null,
        React.createElement(Bottom, { type: text }),
        React.createElement("button", { ref: el, onclick: onclick1 }, text),
        React.createElement("button", { onclick: onclick2 }, bool),
        React.createElement("input", { type: "text", value: text })));
};
export default TextInput;
