import express from "express";

const app = express();

app.get("/index2", (req, res) => {
  res.json({
    code: 200,
    message: "大郭德纲dasd",
  });
});
app.listen(8888, ()=> {
    console.log('index2.js ===============>');
})
