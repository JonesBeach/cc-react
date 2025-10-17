# ABOUT

A clone of React, for learning purposes. Currently stands as a non self-contained (meaning it contains additional things unrelated to Creact) repository that hosts a lite version of nodemon (to watch and re-start the express server). Not that this clone does not involve the parsing/compiling step for React, as that is already handled by `tsc`. Everything in `React.tsx` is relevant to the runtime behavior of React only!

## REQUIREMENTS

-   Linux
-   Node (v20+)
-   `inotify-tools` (for lite-version of nodemon, not required for the Creact itself).

## INSTALLING

```
npm install
```

## START

```
npm run dev
```

It's possible that you need to add permissions to the script file. If you do, run `chmod +x ./scripts/watch.sh`.
