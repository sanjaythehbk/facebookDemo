import { getCommonHeaders } from '../headers/common.headers.js';

export class AuthClient {
  constructor(apiContext) {
    this.request = apiContext.request;
    this.baseUrl = apiContext.baseUrl;
    this.accessToken = apiContext.accessToken;
  }

  async getMe(payload) {
    return this.request.get(`${this.baseUrl}/me`, {
      params: payload,
      headers: getCommonHeaders(this.accessToken)
    });
  }
}
