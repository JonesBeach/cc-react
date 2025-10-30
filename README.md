## ABOUT

A clone of React, for learning purposes. This repository contains a playground and the original source code for testing. Note that this clone does not involve the parsing/compiling step for React, as that is already handled by `tsc`. Everything in the package is relevant to the runtime behavior of React only!

## INSTALLATION

To install:

```
npm install @ccleanershot/cc-react
```
### Vite Setup
If you’re using Vite, start with the React + TypeScript template, then make two small changes:

1. In `tsconfig.app.json`, updated the JSX option:
```
// original
"jsx": "react-jsx" // original
// updated
"jsx": "react" // updated
```
2. In `vite.config.ts`, remove the `react()` plugin:
```
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [],
})
```
Otherwise, if you’re not using Vite, just make sure your `tsconfig.json` includes:
```
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

## USAGE

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

render(<App environment="dev" />, document.getElementById("root")!);
```

Feel free to test beyond the example, and report bugs as you see fit. The goal isn't to clone all of modern-day React, but if the main hooks don't work, that's a problem for the package :).

## REQUIREMENTS

If you need help installing anything, just shoot me a message.

-   Linux
-   [Node](https://nodejs.org/en) (v20+)
-   [Docker](https://www.docker.com/) (required for testing)
-   [`inotify-tools`](https://github.com/inotify-tools/inotify-tools) (required for development)

## CONTRIBUTING

### OVERVIEW

To run the package and the playground locally, you should explore the root `package.json` file for a list of available scripts:

-   `dev`: Runs the package and playground in dev mode for testing. Comes with a custom directory watcher with `inotify-tools`.
-   `upload`: Uploads the package to npm. This is just meant for me to use.
-   `test`: Runs tests

It's possible that you need to add permissions to the script files. If you do, run `cd ./scripts; for f in *; do chmod +x $f; done`.

### DEVELOPMENT

_The development environment uses `inotify-tools`, which is a wrapper over the `inotify` API. If you have trouble running the dev script in relation to the dev server, please check that you have `inotifywait` available as a command._

It's possible that the hardlink for `global.d.ts` in the playground to not be properly hardlink'd to the one from packages. If it is the case, run `ln -f ./packages/cc-react/src/global.d.ts ./playground/src/client` (note: hardlinks are just a placeholder for development, I need to create proper global types).

### TESTING

_Consistent testing environments are often the most critical when doing e2e or integration tests. For this reason, the setup for testing will require an installation of [Docker](https://www.docker.com/). The decision to include e2e tests came as a need to test the exact capabilities of `cc-react` vs. `react`, rather than unit test internal hacks for the hooks and approaches to solving solutions, solutions that are likely solved differently anyways (as the source code for `react` seems intentionally unreadable atm). If you run into an issue during the build step of the Docker container, you can troubleshoot with [dive](https://github.com/wagoodman/dive)._

To start testing:

-   [INCOMPLETE]
-   [INCOMPLETE]
-   [INCOMPLETE]
