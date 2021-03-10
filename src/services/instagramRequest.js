import randomUseragent from 'random-useragent';

export default class InstagramRequest {
  static getFileData(url) {
    return new Promise((resolve, reject) => {
      const userAgent = randomUseragent.getRandom(function (ua) {
        return ua.osName === 'Android';
      });
      const headers = {
        'User-Agent': userAgent,
      };
      fetch(url, {headers})
        .then((res) => res.json())
        .then((requstData) => {
          resolve(requstData.graphql.shortcode_media);
        })
        .catch((err) => reject('ERROR!'));
    });
  }
}
