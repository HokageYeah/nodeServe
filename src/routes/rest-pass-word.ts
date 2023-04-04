import express from "express";

const app = express();

app.get("/rest-pass-word", (req, res) => {
  res.json({
    code: 200,
    message: "重新设置密码？？？",
  });
});
app.listen(8888, ()=> {
    console.log('rest-pass-word.js ===============>');
})
