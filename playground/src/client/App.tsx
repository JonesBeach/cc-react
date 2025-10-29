import React, { render, useState } from "@ccleanershot/cc-react";
import Bottom from "./components/Bottom.tsx";
import Container from "./components/Container.tsx";
import TextInput from "./components/TextInput.tsx";

type Props = {
    environment: "dev" | "prod";
};

const App = ({ environment }: Props) => {
    const [first, setFirst] = useState("app");
    const test = "ewrwer" + first;

    console.log("render", "App");

    return (
        <div draggable>
            <p>I am a {test}</p>
            <TextInput />
            <Container />
            <Bottom type="s" />
            <Bottom type="s" />
            <TextInput />
            <Bottom type="s" />
            <Bottom type="s" />
            <Bottom type="s" />
        </div>
    );
};

render(<App environment="dev" />, document.getElementById("root")!);
