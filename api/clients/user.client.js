import { getCommonHeaders } from '../headers/common.headers.js';

export class UserClient {
  constructor(apiContext) {
    this.request = apiContext.request;
    this.baseUrl = apiContext.baseUrl;
    this.accessToken = apiContext.accessToken;
  }

  async getUserById(userId, fields = 'id,name') {
    const response = await this.request.get(`${this.baseUrl}/${userId}`, {
      params: { fields },
      headers: getCommonHeaders(this.accessToken)
    });
    return { response, body: await response.json() };
  }

  async getPermissions() {
    const response = await this.request.get(`${this.baseUrl}/me/permissions`, {
      headers: getCommonHeaders(this.accessToken)
    });
    return { response, body: await response.json() };
  }
}
