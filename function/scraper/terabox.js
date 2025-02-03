const axios = require('axios');

const terabox = {
  metadata: async (url) => {
    try {
      let surl;
      const parsedUrl = new URL(url);
      const pathSegments = parsedUrl.pathname.split('/');
      surl = pathSegments[1] === 's' ? pathSegments[2] : parsedUrl.searchParams.get('surl');

      const config = {
        method: 'GET',
        url: `https://terabox.hnn.workers.dev/api/get-info?shorturl=${surl}&pwd=`,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
          'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'referer': 'https://terabox.hnn.workers.dev/',
          'origin': 'https://terabox.hnn.workers.dev',
        }
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw new Error(`Metadata fetch failed: ${error.message}`);
    }
  },
  getUrl: async (mdat, fs_id) => {
    try {
      const data = JSON.stringify({
        "shareid": mdat.shareid,
        "uk": mdat.uk,
        "sign": mdat.sign,
        "timestamp": mdat.timestamp,
        "fs_id": fs_id
      });

      const config = {
        method: 'POST',
        url: 'https://terabox.hnn.workers.dev/api/get-download',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36',
          'Content-Type': 'application/json',
          'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'referer': 'https://terabox.hnn.workers.dev/',
          'origin': 'https://terabox.hnn.workers.dev',
        },
        data: data
      };

      const response = await axios.request(config);
      return response.data.downloadLink;
    } catch (error) {
      throw new Error(`Get URL failed: ${error.message}`);
    }
  },
  download: async (url) => {
    try {
      const metadata = await terabox.metadata(url);
      const filesWithUrls = await Promise.all(metadata.list.map(async (file) => {
        const downloadUrl = await terabox.getUrl(metadata, file.fs_id);
        return { ...file, downloadUrl };
      }));

      return filesWithUrls;
    } catch (error) {
      throw new Error(`Download process failed: ${error.message}`);
    }
  }
};

module.exports = terabox;
