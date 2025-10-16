import React from "../Creact.tsx";

type Props = {
    background: string;
};

const Inner = ({ background }: Props) => {
    console.log("render", "Inner");

    return (
        <div>
            <div>Inner</div>
        </div>
    );
};

export default Inner;
