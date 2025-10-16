import React from "../Creact.js";
const Inner = ({ background }) => {
    console.log("render", "Inner");
    return (React.createElement("div", null,
        React.createElement("div", null, "Inner")));
};
export default Inner;
