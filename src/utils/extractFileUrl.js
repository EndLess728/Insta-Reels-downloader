export default function (fileData) {
  let fileInfo = {};
  if (fileData.__typename === 'GraphImage') {
    let imageUrl = fileData.display_url;
    let pageUsername = fileData.owner.username;
    fileInfo.pageUsername = pageUsername;
    fileInfo.type = 'GraphImage';
    fileInfo.data = imageUrl;
    fileInfo.error = false;
  } else if (fileData.__typename === 'GraphVideo') {
    let videoUrl = fileData.video_url;
    let pageUsername = fileData.owner.username;
    fileInfo.pageUsername = pageUsername;
    fileInfo.type = 'GraphVideo';
    fileInfo.data = videoUrl;
    fileInfo.error = false;
  } else {
    fileInfo.error = true;
    fileInfo.pageUsername = null;
    fileInfo.type = null;
    fileInfo.data = null;
  }

  return fileInfo;
}
