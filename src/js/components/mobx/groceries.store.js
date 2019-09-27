import { observable, computed, action } from "mobx";

export default class GroceryStore {
    @observable groceries = [];

    @action
    add(g) {
        this.groceries.push(g);
    }

    @action
    delete(name) {
        this.groceries.remove(name)
    }

    @computed
    get numOfGroceries() {
        return this.groceries.length;
    }
}
