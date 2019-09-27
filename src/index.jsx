import React, { memo } from "react";
import ReactDOM from "react-dom";
import Stats from "./js/components/Stats";
import ThreeJs from "./js/components/Three";

import { Provider } from 'mobx-react';

import GroceryStore from './js/components/mobx/groceries.store.js';
import Add from './js/components/mobx/add.component.jsx';
import GroceriesList from './js/components/mobx/groceriesList.component.jsx';

const groceryStore = new GroceryStore();

const App = memo(() => {
	return (
		<>
			<Provider groceryStore = {groceryStore}>
				<div className="App">
					<Add />
					<GroceriesList />
				</div>
			</Provider>
			<Stats/>
			<ThreeJs/>
		</>
	)
});

ReactDOM.render(<App/>, document.getElementById('app'));
