const webSocketServer = require("websocket").server;
const http = require("http");
const server = http.createServer();
let connections = 0;
let testingData = require("./sample-data/testing-output.json");
//Trading Economics
const te = require("tradingeconomics");

let [, , port, debug] = process.argv;
if (port === undefined) {
	//	console.error("Please define port number");
	//	process.exit(1);
	port = 55456;
}

//All processing should be done here
//Should cache data

server.listen(+port);
if (!debug) te.login("274d8f9dd5e243c:xgu7oa0iggbzumh");
else console.log("Testing environment");

const wsServer = new webSocketServer({
	httpServer: server,
	autoAcceptConnections: false,
});

const allowedOrigin = {
	"http://localhost:3000": true,
	"http://localhost:3001": true,
};

var connection;
function handleRequest(request) {
	//	if (!allowedOrigin[request.origin]) {
	//  if(false){
	//		request.reject();
	//		console.log(`Refusing connection ${request.origin}`);
	//		return;
	//	}
	connection = request.accept("myprotocol", request.origin);
	connections++;
	console.log(`New connection: ${request.origin} ${connections} connections`);
	connection.on("message", (message) => handleMessage(message));
}

function handleClose() {
	connections--;
	console.log(`Connection Closed ${connections} connections`);
}

function handleMessage(message) {
	if (message.type === "utf8") {
		console.log("Received Request: " + message.utf8Data);
		let req = JSON.parse(message.utf8Data);
		// let responsePackage = req.country.map((e) => e);
		let responsePackage = [];
		req.country.forEach((e, i) => (responsePackage[i] = []));
		if (!debug) {
			te.getIndicatorData((country = req.country), (group = req.group)).then(
				(data) => {
					console.log("data", data);
					//Go through matching couples
					let map = new Map();
					data.forEach((e, i) => {
						if (map.size === 0) {
							map.set(data[i]["Category"], i);
							return;
						}
						if (map.has(data[i]["Category"])) {
							map.delete(data[i]["Category"]);
						} else {
							map.set(data[i]["Category"], i);
						}
					});

					//remove unmatched entries
					let iter = map.values();
					let val = iter.next().value;
					let filtered = data.filter((e, i) => {
						if (val === i) {
							val = iter.next().value;
							return false;
						} else {
							return true;
						}
					});

					//reorganize by country
					filtered.forEach((elem) => {
						responsePackage[
							req.country.indexOf(elem.Country.toLowerCase())
						].push(elem);
					});

					const whosBest = (key, A, B) => {
						if (A[key] > B[key]) {
							A[`Best${key}`] = true;
							// console.log(`A wins ${key}`);
						} else if (B[key] > A[key]) {
							B[`Best${key}`] = true;
							// console.log(`B wins ${key}`);
						}
						// else return -1;
					};

					//Mark largest latest, previous, change
					for (let i = 0; i < responsePackage[0].length; i++) {
						let A = responsePackage[0][i];
						let B = responsePackage[1][i];

						//Insert change
						A["Change"] = A["LatestValue"] - A["PreviousValue"];
						B["Change"] = B["LatestValue"] - B["PreviousValue"];

						// const bestLatest = whosBest("LatestValue",A,B);
						// const bestPrevious = whosBest("PreviousValue",A,B);
						// const bestChange = whosBest("Change",A,B);

						// if(bestLatest===0){
						// 	A["BestLatest"] = true;
						// }

						whosBest("LatestValue", A, B);
						whosBest("PreviousValue", A, B);
						whosBest("Change", A, B);
					}
					// console.log(responsePackage);
					connection.sendUTF(JSON.stringify(responsePackage));
				}
			);
		} else {
			console.log("sending test data");
			//
			connection.sendUTF(JSON.stringify(testingData));
			// connection.sendUTF(JSON.stringify(filteredData));
		}
	} else if (message.type === "binary") {
		console.log(
			"Received Binary Message of " + message.binaryData.length + " bytes"
		);
	}
}

wsServer.on("request", (request) => handleRequest(request));
wsServer.on("close", () => handleClose());
