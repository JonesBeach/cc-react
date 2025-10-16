import React from "../Creact.js";
import Inner from "./Inner.js";
export const Container = () => {
    console.log("render", "Container");
    return (React.createElement("div", null,
        React.createElement("p", null, "Container:"),
        React.createElement(Inner, { background: "true" })));
};
export default Container;
