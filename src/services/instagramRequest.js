import randomUseragent from 'random-useragent';

export default class InstagramRequest {
  static getFileData(url) {
    return new Promise((resolve, reject) => {
      const userAgent = randomUseragent.getRandom(function (ua) {
        return ua.osName === 'Android';
      });
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
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
