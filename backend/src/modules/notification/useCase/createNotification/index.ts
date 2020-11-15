import { container } from 'tsyringe';
import CreateNotification from './CreateNotification';

const createNotification = container.resolve(CreateNotification);

export { createNotification };
