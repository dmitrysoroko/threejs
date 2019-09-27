import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';

import Grocery from './grocery.component';

@inject("groceryStore")
@observer
class GroceriesList extends Component {

    render() {
        const store = this.props.groceryStore;
        return (
            <div>
                <h2>Total: {store.numOfGroceries}</h2>
                <div className="list">
                    {store.groceries.map((g,index) =>  <Grocery key={index} name={g}/> )}
                </div>
            </div>

        );
    }
}

export default GroceriesList;
