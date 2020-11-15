import { DomainEvents } from '../../../shared/domain/events/DomainEvents';
import { IHandle } from '../../../shared/domain/events/IHandle';
import { UserCreated } from '../domain/events/userCreated';
import { SendEmailVerifyUseCase } from '../useCases/sendEmailVerify';

export class AfterUserCreated implements IHandle {
  private sendEmail: SendEmailVerifyUseCase;

  constructor(sendEmail: SendEmailVerifyUseCase) {
    this.setupSubscriptions();
    this.sendEmail = sendEmail;
  }

  setupSubscriptions(): void {
    // Register to the domain event
    DomainEvents.register(
      // @ts-ignore
      this.onUserCreatedEvent.bind(this),
      UserCreated.name,
    );
  }

  // This is called when the domain event is dispatched.
  private async onUserCreatedEvent(event: UserCreated): Promise<void> {
    console.log('[AfterUserCreated]: Executed');

    await this.sendEmail.execute({
      title: 'Reveal confirm your email',
      type: 'verified_email',
      email: event.user.email.value,
    });
  }
}
