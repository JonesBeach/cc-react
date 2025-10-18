import express from "express";

const app = express();
app.use(express.static("public"));
app.use("/js", express.static("public/js"));

app.listen(5002, (err) => {
    if (err) {
        console.log("err: ", err);
        return;
    }

    console.log("on!");
});
