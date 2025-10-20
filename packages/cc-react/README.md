# ABOUT

A clone of React, for learning purposes.

## INSTALLATION

To install:

```
npm install @ccleanershot/cc-react
```

To use, use it just like you would with React!

```
import React, { render, useState } from "@ccleanershot/cc-react";

type Props = {
    environment: "dev" | "prod";
};

const App = ({ environment }: Props) => {
    const [number, setNumber] = useState(0);
    const test = "ewrwer" + number;

    console.log("render", "App");

    const onclick = () => {
        setNumber(number + 1);
    }

    return (
        <div draggable>
            <button onclick={onclick}>Increase</button>
            <p>Your number: {test}</p>
        </div>
    );
};

render(<App environment="dev" />, document.getElementById("myapp")!);
```

Feel free to test beyond the example, and report bugs as you see fit. The goal isn't to clone all of modern-day React, but if the main hooks don't work, that's a problem for the package :).
