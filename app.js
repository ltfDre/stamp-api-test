function makeServer() {
  const express = require("express");
  const app = express();
  const port = 3000;

  app.use(express.json());

  const stamps = [];

  app.get("/", (req, res) => {
    res.send("Hello Testing API");
  });

  app.post("/api/reset", (req, res) => {
    stamps.splice(0, stamps.length);
    res.end();
  });

  app.get("/api/stamps", (req, res) => {
    res.json(stamps);
  });

  app.put("/api/stamps", (req, res) => {
    const { id, author, title } = req.body;

    if (id) {
      res.status(400);
      res.json({ error: "Field 'id' is read-only" });
      return;
    }
    if (typeof author === "undefined") {
      res.status(400);
      res.json({ error: "Field 'author' is required" });
      return;
    }
    if (typeof title === "undefined") {
      res.status(400);
      res.json({ error: "Field 'title' is required" });
      return;
    }
    if (author === "") {
      res.status(400);
      res.json({ error: "Field 'author' cannot be empty" });
      return;
    }
    if (title === "") {
      res.status(400);
      res.json({ error: "Field 'title' cannot be empty" });
      return;
    }

    const alreadyExists = stamps.find(
      stamp => stamp.author == author || stamp.title == title
    );
    if (alreadyExists) {
      res.status(400);
      res.json({
        error: "Another stamp with similar title and author already exists"
      });
      return;
    }

    const newStamp = {
      id: +new Date(),
      author,
      title
    };
    stamps.push(newStamp);
    res.status(201);
    res.json(newStamp);
  });

  app.get("/api/stamps/:stampId", (req, res) => {
    const stampId = req.params.stampId;
    const stamp = stamps.find(stamp => stamp.id == stampId);
    if (!stamp) {
      res.status(404);
      res.send({ status: "Stamp does not exist!" });
      return;
    }
    res.json(stamp);
  });

  let server = app.listen(port);

  return server;
}

module.exports = makeServer;
