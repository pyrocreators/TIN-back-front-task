const express = require("express");
const fs = require("fs");
const cookieParser = require("cookie-parser");

const app = express();
app.use(cookieParser());

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function validateEmail(email) {
  const pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  return pattern.test(email);
}

app.get("/form", (req, res) => {
  res.sendFile(__dirname + "/public/form.html");
});

app.post("/submit", (req, res) => {
  const { name } = req.body;
  const { email } = req.body;
  if (name.length < 3) {
    res
      .status(400)
      .send(
        `<h2 style="color: darkred; text-align: center; font-family: Arial, sans-serif; margin-top: 50px;">Name ${name} should be at least 3 characters long!</h2>`
      );
  }
  if (!validateEmail(email)) {
    res
      .status(400)
      .send(
        `<h2 style="color: darkred; text-align: center; font-family: Arial, sans-serif; margin-top: 50px;">Email ${email} is not valid!</h2>`
      );
  }
  res.send(
    `<h2 style="color: #373741; text-align: center; font-family: Arial, sans-serif; margin-top: 50px;">Hello, ${name}!</h2>`
  );
});

app.get("/submit-file-template", (req, res) => {
  res.sendFile(__dirname + "/public/submit-file.html");
});

app.post("/file-submit", (req, res) => {
  const { filename } = req.body;

  fs.readFile(`./${filename}`, "utf8", (err, data) => {
    if (err) {
      res.status(404).send("File not found.");
    }
    res.send(`<p>${data}</p>`);
  });
});

app.get("/set-cookie", (req, res) => {
  res.cookie("user", "John");
  res.send("Cookie set!");
});

app.get("/get-cookie", (req, res) => {
  const user = req.cookies.user;
  res.send(`Cookie value: ${user}`);
});

app.get("/random-number", (req, res) => {
  const randomNumber = Math.floor(Math.random() * 100);
  res.json({ number: randomNumber });
});
