import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { AggregateRoot } from '../../../shared/domain/AggregateRoot';
import { UserId } from '../../users/domain/userId';
import { PostId } from './postId';
import { LikeId } from './likeId';
import { PostLiked } from './events/postLiked';

interface LikeProps {
  owner_post: UserId;
  postId: PostId;
  userId: UserId;
  dateTimePosted?: string | Date;
}

export class Like extends AggregateRoot<LikeProps> {
  get likeId(): LikeId {
    return LikeId.create(this._id);
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

  private constructor(props: LikeProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static create(props: LikeProps, id?: UniqueEntityID): Like {
    const like = new Like({ ...props }, id);
    // if (!id) like.addDomainEvent(new PostLiked(like));
    if (!id && props.owner_post.id.toString() !== props.userId.id.toString()) {
      like.addDomainEvent(new PostLiked(like));
    }
    return like;
  }
}
