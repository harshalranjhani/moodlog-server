require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const dataRoutes = require("./routes/data");
const http = require("http");
const WebSocket = require("ws");
const dataController = require("./controllers/dataController");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to MoodLog!");
});

app.use("/data", dataRoutes);
app.post("/data/predict", async (req, res) => {
  const { temperature, humidity } = req.body;

  if (!temperature || !humidity) {
    return res
      .status(400)
      .send({ error: "Temperature and humidity are required" });
  }

  try {
    const moodResponse = await dataController.predictMood(
      temperature,
      humidity
    );
    const mood = moodResponse.mood;
    const subtitle = moodResponse.subtitle;
    const icon = moodResponse.icon;

    const prediction = {
      mood,
      subtitle,
      icon,
      temperature: temperature,
      humidity: humidity 
    };

    console.log("wss.clients", wss.clients);
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(prediction));
      }
    });

    res.status(200).send(prediction);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "Failed to predict mood and get suggestion" });
  }
});

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = wss;
