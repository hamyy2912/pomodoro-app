import { ERROR_MSG } from '../constants/messages';

export default class LocalStore {
  constructor(name) {
    this.localStorage = window.localStorage;
    this.name = name;
  }

  getItemLocalStorage() {
    try {
      return JSON.parse(this.localStorage.getItem(this.name));
    } catch (error) {
      console.error(ERROR_MSG + error);
    }
  }

  setItemLocalStorage(item) {
    try {
      this.localStorage.setItem(this.name, JSON.stringify(item));
    } catch (error) {
      console.error(ERROR_MSG + error);
    }
  }
}
