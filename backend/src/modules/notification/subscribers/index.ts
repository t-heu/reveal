import { sendNotificationDevice } from '../services/sendNotificationDevice';

import { AfterCommentedPost } from './AfterCommentedPost';
import { AfterLikedPost } from './AfterLikedPost';

new AfterCommentedPost(sendNotificationDevice);
new AfterLikedPost(sendNotificationDevice);
