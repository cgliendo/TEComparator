import { useState, useEffect } from "react";
import "./App.css";
//User defined components
import { Toolbar } from "./components/Toolbar";
import { Exhibit } from "./components/Exhibit";
import { Row } from "./components/Row";
import { ExhibitItem } from "./components/ExhibitItem";
//Material UI
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

// const c = require("./server-client");
import * as c from "./client";
import { Indicator } from "./components/Indicator";
import { flags } from "./components/Flags";

const DEBUG = true;

const createPair = (name) => {
	return { label: name, value: name.toLowerCase() };
};

//---------- This should be requested by client
//receive {availableCountries, availableIndicators}
const countries = [
	createPair("Mexico"),
	createPair("Sweden"),
	createPair("Thailand"),
	createPair("New Zealand"),
];
const indicators = [
	createPair("GDP"),
	createPair("Consumer"),
	createPair("Trade"),
	createPair("Climate"),
	createPair("Health"),
	createPair("Markets"),
	createPair("Government"),
	createPair("Housing"),
	createPair("Prices"),
	createPair("Taxes"),
	createPair("Labour"),
];
//----------------
const theme = createTheme({
	palette: {
		mode: "dark",
	},
});

// DEBUG && console.log("Initialize");
let renderNum = 0;
//-------------------------
//Application
//-------------------------
function App() {
	// DEBUG && console.log("Start render");

	const [selectedCountries, setSelectedCountries] = useState([]);
	const [selectedIndicator, setSelectedIndicator] = useState([]);
	const [receivedData, setReceivedData] = useState([]);

	const handleSetMessageFlag = () => {
		DEBUG && console.log("Message Received");
		setReceivedData([...c.data]);
	};

	useEffect(() => {
		DEBUG && console.group(`Render${renderNum++}`);
		c.connect();
		c.subscribe("msg", handleSetMessageFlag);
		return () => {
			c.close();
			c.unsubscribe("msg");
			console.groupEnd();
		};
	}, []);

	const handleCountrySelection = (e, newValue) => {
		setSelectedCountries(newValue);
	};

	const handleIndicatorSelection = (e, newValue) => {
		setSelectedIndicator(newValue);
	};

	//------------------ This could be moved
	//Need to invalidate data
	//Causes crash if data is pulled and
	//then another country is added
	/////Move this to its own component
	const createExhibitData = (index) => {
		if (receivedData.length > 0) {
			return receivedData[index].map((e, i) => {
				return <Indicator {...e} key={i} />;
			});
		} else {
			return <h2>Hit the Refresh button to pull data.</h2>;
		}
	};

	let exhibits = selectedCountries.map((e, i) => {
		return (
			<ExhibitItem key={`${e.label}${i}`}>
				<h1>
					<span className="flag">{flags[e.label]}</span>
					{e.label}
				</h1>
				{createExhibitData(i)}
			</ExhibitItem>
		);
	});

	console.log(c.data);
	//------------------ end moved

	return (
		<ThemeProvider theme={theme}>
			<div className="App">
				<Toolbar>
					<Row center>
						<Autocomplete
							disablePortal
							multiple
							limitTags={3}
							id="country"
							size="small"
							options={countries}
							sx={{ width: 400 }}
							isOptionEqualToValue={(option, value) =>
								option.value === value.value
							}
							onChange={(e, newValue) => handleCountrySelection(e, newValue)}
							renderInput={(params) => (
								<TextField {...params} label="Countries" />
							)}
						/>
						<Autocomplete
							disablePortal
							// multiple
							// limitTags={3}
							/////// should allow multiple indicator groups
							/////// server-client could prefetch data
							id="indicator"
							size="small"
							options={indicators}
							sx={{ width: 400 }}
							isOptionEqualToValue={(option, value) =>
								option.value === value.value
							}
							onChange={(e, newValue) => handleIndicatorSelection(e, newValue)}
							renderInput={(params) => (
								<TextField {...params} label="Indicator Groups" />
							)}
						/>
						<Button
							onClick={() => {
								c.sendRequest(selectedCountries, [selectedIndicator]);
							}}
							variant="outlined"
							size="small"
						>
							Submit
						</Button>
					</Row>
				</Toolbar>

				<Exhibit>{exhibits}</Exhibit>
			</div>
		</ThemeProvider>
	);
}

export default App;
