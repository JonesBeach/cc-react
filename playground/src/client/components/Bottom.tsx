import React from "cc-react";

type Props = {
    type: string;
};

const Bottom = ({ type }: Props) => {
    console.log("render", "Bottom");

    return <div class={type}>Bottoms</div>;
};

export default Bottom;
