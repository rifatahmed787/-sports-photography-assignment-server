const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Assignment four server");
});

//middleWare
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});