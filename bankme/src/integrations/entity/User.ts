import { IPayable } from '../types/IPayables';

export default class User {
  id: string;
  username: string;
  password: string;

  constructor(
    id?: string,
    username?: string,
    password?: string,
  ) {
    Object.assign(this, { id, username, password });
  }

  toCreate() {
    return {
      username: this.username,
      password: this.password
    };
  }

  toJson() {
    return {
      id: this.id,
      username: this.username,
    };
  }
}
