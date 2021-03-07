import randomUseragent from 'random-useragent';

export default class InstagramRequest {
  static getFileData(url) {
    const headers = {
      'User-Agent': randomUseragent.getRandom(),
    };
    return new Promise((resolve, reject) => {
      fetch(url, {headers})
        .then((res) => res.json())
        .then((requstData) => {
          resolve(requstData.graphql.shortcode_media);
        })
        .catch((err) => reject('ERROR!'));
    });
  }
}
