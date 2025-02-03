const axios = require("axios");

const terabox = {
  metadata: async (url) => {
    try {
      let surl;
      const parsedUrl = new URL(url);
      const pathSegments = parsedUrl.pathname.split("/");

      if (pathSegments[1] === "s") {
        surl = pathSegments[2];
      } else {
        surl = parsedUrl.searchParams.get("surl");
      }

      const config = {
        method: "GET",
        url: `https://terabox.hnn.workers.dev/api/get-info?shorturl=${surl}&pwd=`,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "accept-language": "id-ID",
          referer: "https://terabox.hnn.workers.dev/",
        },
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw new Error("Gagal mengambil metadata: " + error.message);
    }
  },

  getUrl: async (metadata, fs_id) => {
    try {
      const data = JSON.stringify({
        shareid: metadata.shareid,
        uk: metadata.uk,
        sign: metadata.sign,
        timestamp: metadata.timestamp,
        fs_id: fs_id,
      });

      const config = {
        method: "POST",
        url: "https://terabox.hnn.workers.dev/api/get-download",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Content-Type": "application/json",
          "accept-language": "id-ID",
          referer: "https://terabox.hnn.workers.dev/",
        },
        data: data,
      };

      const response = await axios.request(config);
      return response.data.downloadLink;
    } catch (error) {
      throw new Error("Gagal mendapatkan URL unduhan: " + error.message);
    }
  },

  download: async (url) => {
    try {
      const metadata = await terabox.metadata(url);
      const filesWithUrls = await Promise.all(
        metadata.list.map(async (file) => {
          const downloadUrl = await terabox.getUrl(metadata, file.fs_id);
          return { ...file, downloadUrl };
        })
      );
      return filesWithUrls;
    } catch (error) {
      throw new Error("Gagal mengambil daftar file: " + error.message);
    }
  },
};

module.exports = terabox;
