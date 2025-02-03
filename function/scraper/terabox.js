const axios = require("axios");

async function getMetadata(url) {
  try {
    let surl;
    const parsedUrl = new URL(url);
    const pathSegments = parsedUrl.pathname.split("/");

    if (pathSegments[1] === "s") {
      surl = pathSegments[2];
    } else {
      surl = parsedUrl.searchParams.get("surl");
    }

    const response = await axios.get(
      `https://terabox.hnn.workers.dev/api/get-info?shorturl=${surl}&pwd=`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
          Referer: "https://www.terabox.com/",
        },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error("Gagal mengambil metadata: " + error.message);
  }
}

async function getDownloadUrl(metadata, fs_id) {
  try {
    const response = await axios.post(
      "https://terabox.hnn.workers.dev/api/get-download",
      {
        shareid: metadata.shareid,
        uk: metadata.uk,
        sign: metadata.sign,
        timestamp: metadata.timestamp,
        fs_id: fs_id,
      }
    );

    return response.data.downloadLink;
  } catch (error) {
    throw new Error("Gagal mendapatkan URL unduhan: " + error.message);
  }
}

async function teraboxdl(url) {
  try {
    const metadata = await getMetadata(url);
    const files = await Promise.all(
      metadata.list.map(async (file) => {
        const downloadUrl = await getDownloadUrl(metadata, file.fs_id);
        return { ...file, downloadUrl };
      })
    );

    return files;
  } catch (error) {
    throw new Error("Gagal mengambil daftar file: " + error.message);
  }
}

module.exports = teraboxdl;
