import { DomainEvents } from '../../../shared/domain/events/DomainEvents';
import { IHandle } from '../../../shared/domain/events/IHandle';
import { PostLiked } from '../../feed/domain/events/postLiked';
import { SendNotificationDevice } from '../services/sendNotificationDevice/SendNotificationDevice';

export class AfterLikedPost implements IHandle {
  private sendNotification: SendNotificationDevice;

  constructor(sendNotification: SendNotificationDevice) {
    this.setupSubscriptions();
    this.sendNotification = sendNotification;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      // @ts-ignore
      this.onPostLikedEvent.bind(this),
      PostLiked.name,
    );
  }

  private craftMessage(): string {
    return `someone liked your post!`;
  }

  // This is called when the domain event is dispatched.
  private async onPostLikedEvent(event: PostLiked): Promise<void> {
    console.log('[AfterLikedPost]: Executed');

    await this.sendNotification.execute({
      title: 'Liked on your post',
      body: this.craftMessage(),
      data: {},
      type: 'notification_liked_post',
      link: event.like.postId.id.toString(),
    });
  }
}
