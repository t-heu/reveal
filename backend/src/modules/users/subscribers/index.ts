import { sendEmailVerifyUseCase } from '../useCases/sendEmailVerify';

import { AfterUserCreated } from './AfterUserCreated';

new AfterUserCreated(sendEmailVerifyUseCase);
