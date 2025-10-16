import React from "../Creact.tsx";

type Props = {
    type: string;
};

const Bottom = ({ type }: Props) => {
    return <div class={type}>Bottom</div>;
};

export default Bottom;
