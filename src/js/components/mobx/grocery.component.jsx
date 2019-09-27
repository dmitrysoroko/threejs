import React, { Component } from 'react';
import { inject } from 'mobx-react';

@inject("groceryStore")
class Grocery extends Component {

    delete = () => {
        this.props.groceryStore.delete(this.props.name)
    }
    render() {
        return (
            <li className="grocery" onClick={this.delete} key={this.props.index}>{this.props.name}</li>
        );
    }
}

export default Grocery;
