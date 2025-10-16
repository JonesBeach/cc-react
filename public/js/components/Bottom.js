import React from "../Creact.js";
const Bottom = ({ type }) => {
    console.log("render", "Bottom");
    return React.createElement("div", { class: type }, "Bottoms");
};
export default Bottom;
