import React, { render, useState } from "./Creact.js";
import Bottom from "./components/Bottom.js";
import Container from "./components/Container.js";
import TextInput from "./components/TextInput.js";
const App = ({ environment }) => {
    const [first, setFirst] = useState("app");
    const test = "ewrwer" + first;
    console.log("render", "App");
    return (React.createElement("div", { draggable: true },
        React.createElement("p", null,
            "I am a ",
            test),
        React.createElement(TextInput, null),
        React.createElement(Container, null),
        React.createElement(Bottom, { type: "s" }),
        React.createElement(Bottom, { type: "s" }),
        React.createElement(TextInput, null),
        React.createElement(Bottom, { type: "s" }),
        React.createElement(Bottom, { type: "s" }),
        React.createElement(Bottom, { type: "s" })));
};
render(React.createElement(App, { environment: "dev" }), document.getElementById("myapp"));
