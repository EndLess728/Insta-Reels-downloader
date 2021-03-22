import UserAgent from 'user-agents';

export default class InstagramRequest {
  static getFileData(url) {
    return new Promise((resolve, reject) => {
      const userAgent = new UserAgent({
        deviceCategory: 'mobile',
        platform: 'Linux armv8l',
      });
      const headers = {
        'User-Agent': userAgent.toString(),
      };
      fetch(url, {headers})
        .then((res) => res.json())
        .then((requstData) => {
          resolve(requstData.graphql.shortcode_media);
        })
        .catch((err) => reject(JSON.stringify(err)));
    });
  }
}
