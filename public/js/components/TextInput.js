import React, { useEffect, useState } from "../Creact.js";
import Bottom from "./Bottom.js";
const TextInput = () => {
    const [text, setText] = useState("default");
    const [bool, setBool] = useState(true);
    console.log("render", "TextInput", text, bool);
    const onclick1 = () => {
        setText(text + "1");
    };
    const onclick2 = () => {
        setBool(!bool);
    };
    useEffect(() => {
        console.log("effect", "TextInput", bool);
        return () => {
            console.log("unmounting", "TextInput", bool);
        };
    }, [bool]);
    return (React.createElement("div", null,
        React.createElement(Bottom, { type: text }),
        React.createElement("button", { onclick: onclick1 }, text),
        React.createElement("button", { onclick: onclick2 }, bool),
        React.createElement("input", { type: "text", value: text })));
};
export default TextInput;
