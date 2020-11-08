import { v4 as uuidv4 } from 'uuid';

export class UniqueEntityID {
  private value: string | number;

  constructor(id?: string | number) {
    this.value = id || uuidv4();
  }

  equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    if (!(id instanceof this.constructor)) {
      return false;
    }
    return id.toValue() === this.value;
  }

  toString(): string {
    return String(this.value);
  }

  /**
   * Return raw value of identifier
   */

  toValue(): string | number {
    return this.value;
  }
}
