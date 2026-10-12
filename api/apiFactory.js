import { AuthClient } from './clients/auth.client.js';
import { UserClient } from './clients/user.client.js';

export const apiFactory = (apiContext) => ({
  auth: new AuthClient(apiContext),
  user: new UserClient(apiContext)
});
