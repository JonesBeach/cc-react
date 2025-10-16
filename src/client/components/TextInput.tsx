import React, { useEffect, useState } from "../Creact.tsx";
import Bottom from "./Bottom.tsx";

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

    return (
        <div>
            <Bottom type={text} />
            <button onclick={onclick1}>{text}</button>
            <button onclick={onclick2}>{bool}</button>
            <input type="text" value={text} />
        </div>
    );
};

export default TextInput;
