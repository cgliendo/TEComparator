//--------- Server
let client;
let W3CWebSocket;
let init = false;
let connected = false;
export let data = [];
let subscriptions = {};
const port = 55456;
let connections = 0;
// You may need to change the host value to
// the appropriate IP address
//let host = '';
let host = 'localhost'
// const [, , port] = process.argv;

// if (port === undefined) {
// 	console.error("Please define port number");
// 	process.exit(1);
// }
W3CWebSocket = require("websocket").w3cwebsocket;

const establishConnection = () => {
	if (!init) {
		client = new W3CWebSocket(`ws://${host}:${port}/`, "myprotocol");
		init = true;
	}
};

export const connect = () => {
	// let connectInterval;
	establishConnection();
	client.onclose = function () {
		console.log("%cConnection Closed", "color:red");
		init = connected = false;
		connections--;
	};
	client.onerror = function () {
		console.log("%cConnection Error", "color:red");
	};
	client.onopen = function () {
		console.log(
			`%cWebSocket Client Connected: ${++connections} connections`,
			"color:green"
		);
		connected = true;
	};
	client.onmessage = function (e) {
		data = [...JSON.parse(e.data)];
		// console.log("data", data);
		Object.values(subscriptions).forEach((s) => s());
	};
};

export const subscribe = (name, subscriberFn) => {
	if (!subscriptions[name]) subscriptions[name] = subscriberFn;
};
export const unsubscribe = (name) => {
	if (subscriptions[name]) subscriptions[name] = undefined;
};

export const close = () => {
	if (connected === true) {
		client.close();
	} else {
		console.log("Not connected yet, Ignoring close");
	}
};

export const sendRequest = (countries, indicatorGroups) => {
	let country = countries.map((c) => c.value);
	let group = indicatorGroups.map((g) => g.value);
	let request = { country: country, group: group };
	client.send(JSON.stringify(request));
};

//-------------
