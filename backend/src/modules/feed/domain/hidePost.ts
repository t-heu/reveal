import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UserId } from '../../users/domain/userId';
import { PostId } from './postId';
import { HidePostId } from './hidePostId';

interface HidePostProps {
  postId: PostId;
  userId: UserId;
  dateTimePosted?: string | Date;
}

export class HidePost extends AggregateRoot<HidePostProps> {
  get likeId(): HidePostId {
    return HidePostId.create(this._id);
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  get dateTimePosted(): string | Date {
    return this.props.dateTimePosted || new Date();
  }

  get postId(): PostId {
    return this.props.postId;
  }

  get userId(): UserId {
    return this.props.userId;
  }

  private constructor(props: HidePostProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: HidePostProps, id?: UniqueEntityID): HidePost {
    const like = new HidePost({ ...props }, id);
    return like;
  }
}
