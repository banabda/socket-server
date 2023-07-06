const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

require("dotenv").config();

var app_name = "";

app.get("/", (req, res) => {
	var _connClients = io.engine.clientsCount;
	var _rooms = io.sockets.adapter.rooms;
	var _room_names = _rooms.keys();

	var room_list = "";
	_rooms.forEach((val, room) => {
		room_list += `<li>${room}: ${Array.from(val).length}</li>`;
	});

	res.send(`<div>
							<h1>Welcome to Hakuba Socket!</h1>
							<h2>Current clients connected : ${_connClients}</h2>
							<ul>${room_list}</ul>
						</div>
						`);
});

io
	.use((socket, next) => {
		const token = socket.handshake.auth.token;

		if (token == process.env.TOKENMOMENBAHAGIA) {
			app_name = "momen bahagia";
		} else if (token == process.env.TOKENFINANCE) {
			app_name = "finance";
		} else if (token == process.env.TOKENWABOTAPI) {
			app_name = "wabot";
		} else if (token == process.env.TOKENMURAHNIH) {
			app_name = "murahnih";
		} else {
			const err = new Error("not authorized");
			err.data = { success: false, content: "Please retry later", status: 403 };
			return next(err);
		}
		return next();
	})
	.on("connection", (socket) => {
		console.log("Client connected", socket.id, socket.rooms);

		// socket.join("some room");
		// io.to("some room").emit("some event", app_name);

		if (["wabot", "momen bahagia", "murahnih"].includes(app_name)) {
			socket.on("send-message", (message) => {
				io.emit("new-message", message);
			});

			socket.on("send-qr-string", (data) => {
				io.emit("qr-" + data.device_id, data);
			});
		}

		// console.log(io.allSockets());

		socket.on("disconnect", () => {
			console.log("Client disconnected", app_name, socket.id, socket.rooms);
		});
	});

const port = process.env.PORT || 3000;
server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
