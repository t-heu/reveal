import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { Entity } from '../../../shared/domain/Entity';

export class LikeId extends Entity<any> {
  get id(): UniqueEntityID {
    return this._id;
  }

  private constructor(id?: UniqueEntityID) {
    super(null, id);
  }

  public static create(id?: UniqueEntityID): LikeId {
    return new LikeId(id);
  }
}
