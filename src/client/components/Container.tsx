import React from "../Creact.tsx";
import Inner from "./Inner.tsx";

export const Container = () => {
    console.log("render", "Container");

    return (
        <div>
            <p>Container:</p>
            <Inner background="true" />
        </div>
    );
};

export default Container;
