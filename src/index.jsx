import React, { memo } from "react";
import ReactDOM from "react-dom";
import Stats from "./js/components/Stats";
import ThreeJs from "./js/components/Three";

const App = memo(() => {
	return (
		<>
			<Stats/>
			<ThreeJs/>
		</>
	)
});

ReactDOM.render(<App/>, document.getElementById('app'));
