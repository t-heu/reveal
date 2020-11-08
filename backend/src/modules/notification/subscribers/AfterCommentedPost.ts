import { DomainEvents } from '../../../shared/domain/events/DomainEvents';
import { IHandle } from '../../../shared/domain/events/IHandle';
import { PostCommented } from '../../feed/domain/events/postCommented';
import { CommentText } from '../../feed/domain/commentText';
import { SendNotificationDevice } from '../services/sendNotificationDevice/SendNotificationDevice';

export class AfterCommentedPost implements IHandle {
  private sendNotification: SendNotificationDevice;

  constructor(sendNotification: SendNotificationDevice) {
    this.setupSubscriptions();
    this.sendNotification = sendNotification;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      // @ts-ignore
      this.onPostCommentedEvent.bind(this),
      PostCommented.name,
    );
  }

  private craftMessage(comment: CommentText): string {
    return comment.value.toString() || `someone commented your post!`;
  }

  // This is called when the domain event is dispatched.
  private async onPostCommentedEvent(event: PostCommented): Promise<void> {
    console.log('[AfterCommentedPostEvent]: Executed');

    await this.sendNotification.execute({
      title: 'Someone commented your post', // 'Comment on your post',
      body: this.craftMessage(event.comment.text),
      data: {},
      type: 'notification_commented_post',
      link: event.comment.postId.id.toString(),
    });
  }
}
