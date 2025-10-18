# ABOUT

A clone of React, for learning purposes. This repository contains a playground and the original source code for testing. Note that this clone does not involve the parsing/compiling step for React, as that is already handled by `tsc`. Everything in the package is relevant to the runtime behavior of React only!

## INSTALLATION

To install:

```
npm install @ccleanershot/cc-react
```

To use, use it just like you would with React!

```
import React, { render, useState } from "cc-react";

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

## REQUIREMENTS

-   Linux
-   Node (v20+)
-   `inotify-tools` (for lite-version of nodemon, not required for the Creact itself).

## DEVELOPMENT

To run the package and the playground locally, you should explore the root `package.json` file for a list of available scripts:

`dev`: Runs the package and playground in dev mode for testing. Comes with a custom directory watcher with `inotify-tools`.
`upload`: Uploads the package to npm. This is just meant for me to use.

It's possible that you need to add permissions to the script files. If you do, run `cd ./scripts; for f in *; do chmod +x $f; done`.
It's possible that the hardlink for `global.d.ts` in the playground to not be properly hardlink'd to the one from packages. If it is the case, run `ln -f ./packages/cc-react/src/global.d.ts ./playground/src/client` (note: hardlinks are just a placeholder for development, I need to create proper global types).
