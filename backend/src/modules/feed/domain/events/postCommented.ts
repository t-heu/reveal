import { IDomainEvent } from '../../../../shared/domain/events/IDomainEvent';
import { UniqueEntityID } from '../../../../shared/domain/UniqueEntityID';
import { Comment } from '../comment';
// import { Post } from '../post';

export class PostCommented implements IDomainEvent {
  public dateTimeOccurred: Date;

  public comment: Comment;

  // public post: Post | null;

  constructor(comment: Comment /* , post?: Post */) {
    this.dateTimeOccurred = new Date();
    this.comment = comment;
    // this.post = post || null;
  }

  getAggregateId(): UniqueEntityID {
    return this.comment.id;
  }
}
