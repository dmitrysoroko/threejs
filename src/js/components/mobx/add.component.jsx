import React, { Component } from 'react';
import { inject } from 'mobx-react';

@inject("groceryStore")
class Add extends Component {
    constructor(props) {
        super();
        this.state = {
            inputValue: ''
        }
    }

    updateInputValue = (evt) => {
        this.setState({
            inputValue: evt.target.value
        });
    }

    add = () => {
        this.props.groceryStore.add(this.state.inputValue)
        this.setState({
            inputValue: ''
        });
    }
    render() {
        return (
            <div className="App">
            <div className="add-grocery">
            <input placeholder="Add new" type="text" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
        <button onClick={this.add}>Add</button>
            </div>
            </div>
    );
    }
}

export default Add;
