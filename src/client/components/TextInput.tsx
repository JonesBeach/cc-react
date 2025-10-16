import React, { useState } from "../Creact.tsx";
import Bottom from "./Bottom.tsx";

const TextInput = () => {
    const [text, setText] = useState("default");

    console.log("render", "TextInput", text);

    const onclick = () => {
        setText(text + "1");
    };

    return (
        <div>
            <Bottom type={text} />
            <button onclick={onclick}>{text}</button>
            <input type="text" value={text} />
        </div>
    );
};

export default TextInput;
