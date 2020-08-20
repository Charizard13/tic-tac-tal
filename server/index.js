const express = require("express");
const { fstat } = require("fs");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const fs = require("fs").promises;

app.use(express.static(path.join(__dirname, "../client/build")));


app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.get("/api/v1/records", async (req, res) => {
  const content = await fs.readFile("./records.json");
  const json = JSON.parse(content);
  res.send(json);
});

app.delete("/api/v1/records", async (req, res) => {
  await fs.writeFile("./records.json", '[]');
  res.send("deleted");
});



app.post("/api/v1/records", async (req, res) => {
  if (req.body) {
    const content = await fs.readFile("./records.json");
    const json = JSON.parse(content);
    req.body.id = json.length;
    json.push(req.body);
    await fs.writeFile("./records.json", JSON.stringify(json));

    res.send(req.body);
  }
  res.send("ohoh");
});

// app.put("/products/:id", (req, res) => {
//   winnerList.forEach((product, i) => {
//     if (product.id == req.params.id) {
//       winnerList[i] = req.body;
//       res.send(req.body);
//     }
//   });
// });

// app.delete("/products/:id", (req, res) => {
//   winnerList.forEach((product, i) => {
//     if (product.id == req.params.id) {
//       winnerList.splice(i, 1);
//       res.send(`You no longer need item ${req.params.id}`);
//     }
//   });
// });

app.listen(4000, () => console.log("listening on port 4000..."));
