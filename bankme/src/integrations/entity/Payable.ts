import { IPayable } from '../types/IPayables';

export default class Payable implements IPayable {
  id: string;
  value: number;
  emissionDate: Date;
  assignorId: string;

  constructor(
    id?: string,
    value?: number,
    emissionDate?: Date,
    assignorId?: string,
  ) {
    Object.assign(this, { id, value, emissionDate, assignorId });
  }

  toCreate() {
    return {
      id: this.id,
      value: Number(this.value),
      emissionDate: new Date(this.emissionDate),
      assignorId: this.assignorId,
    };
  }
}
