import { Mapper } from '../../../shared/infra/Mapper';
import { Comment } from '../domain/comment';
import { ICommentDTO } from '../dtos/ICommentDTO';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { CommentText } from '../domain/commentText';
import { UserId } from '../../users/domain/userId';
import { PostId } from '../domain/postId';

class CommentMap implements Mapper<Comment> {
  public toDTO(t: Comment): ICommentDTO {
    return {
      id: t.id.toValue().toString(),
      text: t.text.value,
      dateTimePosted: new Date(t.dateTimePosted),
      avatar_URL: t.avatarUrl,
      user_id: String(t.userId),
      post_id: String(t.postId),
    };
  }

  public toDomain(raw: any): Comment {
    const commentTextOrError = CommentText.create({ value: raw.answer });

    const comment = Comment.create(
      {
        text: commentTextOrError,
        dateTimePosted: new Date(raw.createdAt),
        photo: raw.user.photo,
        userId: UserId.create(new UniqueEntityID(raw.user_id)),
        postId: PostId.create(new UniqueEntityID(raw.post_id)),
        owner_post: UserId.create(new UniqueEntityID(raw.user_id)),
      },
      new UniqueEntityID(raw.id),
    );

    return comment;
  }

  public async toPersistence(t: Comment): Promise<any> {
    return {
      id: t.id.toValue().toString(),
      answer: t.text.value,
      createdAt: t.dateTimePosted,
      user_id: t.userId.id.toString(),
      post_id: t.postId.id.toString(),
    };
  }
}

export default new CommentMap();
