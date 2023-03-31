import express from "express";

const app = express();

app.get("/index", (req, res) => {
  res.json({
    code: 200,
    message: "大dasd",
  });
});
app.listen(9999, ()=> {
    console.log('index.js ===============>');
})
let a: number = 999
console.log(a);
