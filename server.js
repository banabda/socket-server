const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

io.on("connection", (socket) => {
	console.log("Client connected", socket.id, socket.rooms);

	socket.join("some room");

	socket.on("send-message", (message) => {
		io.emit("new-message", message);
	});

	socket.on("send-qr-string", (data) => {
		io.emit("qr-" + data.device_id, data);
	});

	socket.on("disconnect", () => {
		console.log("Client disconnected");
	});

	io.to("some room").emit("some event", socket.id);
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
