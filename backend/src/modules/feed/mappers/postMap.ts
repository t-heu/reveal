import { Mapper } from '../../../shared/infra/Mapper';
import { Post } from '../domain/post';
import { UserId } from '../../users/domain/userId';
import { IPostDTO } from '../dtos/IPostDTO';
import { UniqueEntityID } from '../../../shared/domain/UniqueEntityID';
import { PostText } from '../domain/postText';

class PostMap implements Mapper<Post> {
  public toDTO(t: Post): IPostDTO {
    return {
      id: t.id.toString(),
      text: t.text.value,
      dateTimePosted: new Date(t.dateTimePosted),
      viewer_count_comments: t.totalNumComments,
      viewer_count_likes: t.totalNumlikes,
      viewer_has_liked: t.postLiked,
      userId: t.userId.id.toString(),
      viewer_has_hidePost: t.has_hidePost,
      user: {
        avatar_url: t.avatarUrl.value,
      },
    };
  }

  public toDomain(raw: any): Post {
    const postTextOrError = PostText.create({ value: raw.description });

    const post = Post.create(
      {
        text: postTextOrError,
        dateTimePosted: new Date(raw.createdAt),
        viewer_count_comments: raw.viewer_count_comments,
        viewer_count_likes: raw.viewer_count_likes,
        viewer_has_liked: raw.viewer_has_liked,
        userId: UserId.create(new UniqueEntityID(raw.user_id)),
        has_hidePost: raw.has_hidePost,
        photo: raw.user.photo,
      },
      new UniqueEntityID(raw.id),
    );

    return post;
  }

  public async toPersistence(t: Post): Promise<any> {
    return {
      id: t.id.toValue().toString(),
      description: t.text.value,
      createdAt: t.dateTimePosted,
      user_id: t.userId.id.toString(),
    };
  }
}

export default new PostMap();
