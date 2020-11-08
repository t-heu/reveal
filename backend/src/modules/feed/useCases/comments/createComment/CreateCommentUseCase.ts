import { inject, injectable } from 'tsyringe';

import { ICommentRepository } from '../../../repos/ICommentRepo';
import { IPostRepository } from '../../../repos/IPostRepo';
import { AddCommentDTO } from './CreateCommentDTO';
import { IUseCase } from '../../../../../shared/domain/UseCase';
import { CommentText } from '../../../domain/commentText';
import { Comment } from '../../../domain/comment';
import { PostId } from '../../../domain/postId';
import { UserId } from '../../../../users/domain/userId';
import { UniqueEntityID } from '../../../../../shared/domain/UniqueEntityID';

@injectable()
class CreateCommentUseCase implements IUseCase<AddCommentDTO, void> {
  constructor(
    @inject('CommentRepository')
    private commentRepository: ICommentRepository,
    @inject('PostRepository')
    private postRepository: IPostRepository,
  ) {}

  public async execute({
    idPost,
    userID,
    answer,
  }: AddCommentDTO): Promise<void> {
    const text = CommentText.create({ value: answer });

    const post = await this.postRepository.getPostById(idPost);

    const comment = Comment.create({
      owner_post: UserId.create(new UniqueEntityID(post.user_id)),
      text,
      userId: UserId.create(new UniqueEntityID(userID)),
      postId: PostId.create(new UniqueEntityID(idPost)),
    });

    await this.commentRepository.create(comment);
  }
}

export default CreateCommentUseCase;
