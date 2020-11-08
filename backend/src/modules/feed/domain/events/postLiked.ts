import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { Like } from '../like';

export class PostLiked implements IDomainEvent {
  public dateTimeOccurred: Date;

  public like: Like;

  constructor(like: Like) {
    this.dateTimeOccurred = new Date();
    this.like = like;
  }

  getAggregateId(): UniqueEntityID {
    return this.like.id;
  }
}
