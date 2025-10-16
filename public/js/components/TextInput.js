import React, { useState } from "../Creact.js";
import Bottom from "./Bottom.js";
const TextInput = () => {
    const [text, setText] = useState("default");
    console.log("render", "TextInput", text);
    const onclick = () => {
        setText(text + "1");
    };
    return (React.createElement("div", null,
        React.createElement(Bottom, { type: text }),
        React.createElement("button", { onclick: onclick }, text),
        React.createElement("input", { type: "text", value: text })));
};
export default TextInput;
