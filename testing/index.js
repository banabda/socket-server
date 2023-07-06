require("dotenv").config();
const io = require("socket.io-client");

const socket = io("http://localhost:3000", {
	transports: ["websocket", "polling", "flashsocket"],
	auth: {
		token: process.env.TOKENMOMENBAHAGIA,
	},
});
socket.on("connect_error", (err) => {
	console.log(err instanceof Error);
	console.log(err.message);
	console.log(err.data);
});

socket.on("some event", (message) => {
	console.log("🚀 ~ file: index.js:17 ~ socket.on ~ message:", message);
});
