// Graph API accepts the user token as a Bearer header, which keeps it out of URLs and logs
export const getCommonHeaders = (accessToken) => ({
  accept: 'application/json',
  authorization: `Bearer ${accessToken}`
});
