require('./settings.js')
var express = require("express"), cors = require("cors"), secure = require("ssl-express-www");
const path = require('path');
const os = require('os');
const fs = require('fs');
const ptz = require('./function/index') 
const axios = require('axios')
const isUrl = require("is-url")
const cheerio = require('cheerio');
const util = require('minecraft-server-util');
const toRupiah = require('./function/scraper/torupiah')
const malScraper = require('mal-scraper');
const { checkApikey, updateStats, getStats } = require('./MongoDB/function');
const { connectMongoDb } = require('./MongoDB/connect');
connectMongoDb();
var creator = global.creator;

var app = express();
app.enable("trust proxy");
app.set("json spaces", 2);
app.use(cors());
app.use(secure);
const port = 3000;


app.get('/stats', (req, res) => {
  const stats = {
    platform: os.platform(),
    architecture: os.arch(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    uptime: os.uptime(),
    cpuModel: os.cpus()[0].model,
    numCores: os.cpus().length,
    loadAverage: os.loadavg(),
    hostname: os.hostname(),
    networkInterfaces: os.networkInterfaces(),
    osType: os.type(),
    osRelease: os.release(),
    userInfo: os.userInfo(),
    processId: process.pid,
    nodeVersion: process.version,
    execPath: process.execPath,
    cwd: process.cwd(),
    memoryUsage: process.memoryUsage()
  };
  res.json(stats);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  'index.html'));
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'docs.html'));
});


app.get('/api/game/samp', async (req, res) => {
    const { ip, port, apikey } = req.query;

    if (!apikey) {
        return res.status(403).json({
            status: 403,
            message: "Apikey Dibutuhkan",
            result: "error"
        });
    }

    if (!checkApikey(apikey)) {
        return res.status(403).json({
            status: 403,
            message: "Apikey Tidak Valid",
            result: "error"
        });
    }

    if (!ip || !port) {
        return res.status(400).json({
            status: 400,
            message: "Harap sertakan IP dan port dalam permintaan.",
            result: "error"
        });
    }

    try {
        const serverStatus = await ptz.getServerStatus(ip, port);

        if (serverStatus) {
    
            res.json({
                status: true,
                total_requests: totalRequests,
                total_pengguna_apikey: totalPenggunaApikey,
                results: {
                    IPServer: serverStatus.ip,
                    PortServer: serverStatus.port,
                    NamaServer: serverStatus.hostname,
                    PemainOnline: serverStatus.players_online,
                    MaxPemain: serverStatus.max_players,
                    GameMode: serverStatus.gamemode,
                    Map: serverStatus.map_name,
                    Version: serverStatus.version,
                    Weather: serverStatus.weather,
                    Url: serverStatus.web_url,
                    Time: serverStatus.world_time,
                    Players: serverStatus.players
                }
            });
        } else {
            res.status(503).json({ status: false, message: "Server sedang offline/MT." });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ status: false, error: "Terjadi kesalahan saat menghubungi server." });
    }
});
app.get('/api/islam/niatmagrib', async (req, res, next) => {
    var apikey = req.query.apikey
    var text = req.query.page
    
    fetch(encodeURI(`https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/NiatMaghrib.json`))
        .then(response => response.json())
        .then(data => {
            var result = data;
            res.json({
                result
            })
        })
        .catch(e => {
            console.log(e);
            res.json(loghandler.error)
        })
});

app.get('/api/downloader/capcut', async (req, res) => {
    const { url } = req.query; // Extract URL from query parameter

    // Check if the URL is provided
    if (!url) {
        return res.status(400).json({ error: '❌ URL is required. Example: /api/downloader/capcut?url=[CapCut URL]'});
    }

    try {
        const result = await ptz.capcutdl(url); // Call the scraper function

        if (!result) {
            return res.status(400).json({ error: '❌ Gagal mendapatkan data. Pastikan URL yang dimasukkan benar.'});
        }

        const cpt = `*乂 C A P C U T - D O W N L O A D E R*\n\n   ◦ Title : ${result.title}\n   ◦ Date : ${result.date}\n   ◦ Pengguna : ${result.pengguna}\n   ◦ Likes : ${result.likes}\n   ◦ Author : ${result.author.name}`;
        
        // Send video URL and information back to the client
        return res.json({
            message: cpt,
            videoUrl: result.videoUrl,
            posterUrl: result.posterUrl,
            thumbnail: result.posterUrl
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Terjadi kesalahan saat mengambil data.');
    }
});

app.get('/api/downloader/mediafire', async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({
            status: false,
            message: "Masukkan URL MediaFire yang valid! Contoh: /api/downloader/mediafire?url=https://www.mediafire.com/file/qyk2na28cidzt3p/cf2.js/file"
        });
    }

    // Validasi format URL MediaFire
    const mediafireRegex = /^(https?:\/\/)?(www\.)?mediafire\.com\/.+$/i;
    if (!mediafireRegex.test(url)) {
        return res.status(400).json({
            status: false,
            message: "URL tidak valid! Pastikan itu adalah URL dari MediaFire."
        });
    }

    try {
        // Menggunakan API pihak ketiga untuk mendapatkan informasi file
        const response = await axios.post('http://kinchan.sytes.net/mediafire/download', { url });
        const result = response.data;

        // Jika terjadi kesalahan dalam pengambilan data
        if (result.error) {
            return res.status(500).json({
                status: false,
                message: result.error
            });
        }

        res.json({
            status: true,
            creator: `${creator}`,
            results: {
                filename: result.filename,
                size: result.size,
                mimetype: result.mimetype,
                downloadUrl: result.download
            }
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Terjadi kesalahan saat memproses permintaan.",
            error: error.message
        });
    }
});

app.get("/api/tiktok", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "URL is required." });

  try {
    const { tiktokdl } = require("tiktokdl");
    const data = await tiktokdl(url);
    if (!data) return res.status(404).json({ error: "No data found." });
    res.json({ status: true, creator: "Fajar Official", result: data });
  } catch (e) {
    res.status(500).json({ error: "Internal server error." });
  }
});

app.get('/api/islam/niatisya', async (req, res) => {
    var text = req.query.page
    
    fetch(encodeURI(`https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/refs/heads/master/data/NiatIsya.json`))
        .then(response => response.json())
        .then(data => {
            var result = data;
            res.json({
                result
            })
        })
        .catch(e => {
            console.log(e);
            res.json(loghandler.error)
        })
});

app.get('/api/islam/niatashar', async (req, res) => {
    
    fetch(encodeURI(`https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/NiatIsya.json`))
        .then(response => response.json())
        .then(data => {
            var result = data;
            res.json({
                result
            })
        })
        .catch(e => {
            console.log(e);
            res.json(loghandler.error)
        })
});

app.get('/api/islam/niatsubuh', async (req, res) => {
    
    fetch(encodeURI(`https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/NiatShubuh.json`))
        .then(response => response.json())
        .then(data => {
            var result = data;
            res.json({
                result
            })
        })
        .catch(e => {
            console.log(e);
            res.json(loghandler.error)
        })
});

app.get('/api/islam/niatzuhur', async (req, res) => {
    
    fetch(encodeURI(`https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/NiatDzuhur.json`))
        .then(response => response.json())
        .then(data => {
            var result = data;
            res.json({
                result
            })
        })
        .catch(e => {
            console.log(e);
            res.json(loghandler.error)
        })
});

app.get('/api/islam/niatshalat', async (req, res) => {
    var text = req.query.page
    
    fetch(encodeURI(`https://raw.githubusercontent.com/zeeoneofficial/My-SQL-Results/master/data/dataNiatShalat.json`))
        .then(response => response.json())
        .then(data => {
            var result = data;
            res.json({
                result
            })
        })
        .catch(e => {
            console.log(e);
            res.json(loghandler.error)
        })
});

app.get('/api/islam/jadwalshalat', async (req, res) => {
    const kota = req.query.kota;

    // Ensure a city is specified in the query
    if (!kota) {
        return res.status(400).json({
            message: '📍 Masukkan nama kota yang kamu tuju!'
        });
    }

    try {
        const { data } = await axios.get(`https://jadwal-sholat.tirto.id/kota-${kota}`);
        const $ = cheerio.load(data);
      
        const jadwal = $('tr.currDate td').map((i, el) => $(el).text()).get();

        // Check if we found the prayer times (7 items: tanggal, subuh, duha, dzuhur, ashar, maghrib, isya)
        if (jadwal.length === 7) {
            const [tanggal, subuh, duha, dzuhur, ashar, maghrib, isya] = jadwal;

            // Build the response message
            const zan = `
╭──[ *📅 Jadwal Sholat* ]──✧
᎒⊸ *🌆 Kota*: ${kota.charAt(0).toUpperCase() + kota.slice(1)}
᎒⊸ *📅 Tanggal*: ${tanggal}

╭──[ *🕰️ Waktu Sholat* ]──✧
᎒⊸ *Subuh:* ${subuh}
᎒⊸ *Duha:* ${duha}
᎒⊸ *Dzuhur:* ${dzuhur}
᎒⊸ *Ashar:* ${ashar}
᎒⊸ *Maghrib:* ${maghrib}
᎒⊸ *Isya:* ${isya}
╰────────────•`;

            return res.json({ message: zan });
        } else {
            return res.status(404).json({
                message: '❌ Jadwal sholat tidak ditemukan. Pastikan nama kota sesuai.'
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: '❌ Terjadi kesalahan saat mengambil data!'
        });
    }
});

app.get("/api/translate", async (req, res) => {
  const text = req.query.text;
  if (!text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const response = await axios.get("https://api.siputzx.my.id/api/tools/translate", {
      params: { text: text, source: "auto", target: "id" },
    });

    res.json({ 
      creator: "Fajar Official",
      result: response.data.translatedText
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing the translation." });
  }
});

app.get('/api/search/ttstalk', async (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ error: 'Masukkan username TikTok yang ingin Anda stalk. Contoh: /api/search/ttstalk?username=username' });
    }

    try {
        const result = await ptz.tiktokStalk(username);
        const { userInfo } = result;

        let message = `[ User Metadata ]\n\n`;
        message += Object.entries(userInfo)
            .map(([key, value]) => `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
            .join("\n");

        res.json({ message });

    } catch (error) {
        res.status(500).json({ error: `Gagal mengambil data: ${error.message}` });
    }
});

app.get('/api/downloader/igdl', async (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).json({ error: "Parameter 'url' diperlukan!" });
        }

        if (!url.match(/instagram\.com\/(reel|p|tv)/gi)) {
            return res.status(400).json({ error: "URL harus berupa link Instagram Reel, Post, atau TV!" });
        }

        const result = await ptz.instanav(url);

        if (!result || result.downloadUrls[0] === 'Download URL not found') {
            return res.status(404).json({ error: "Media tidak ditemukan!" });
        }

        res.json({
            title: result.title,
            thumbnail: result.thumbnail,
            downloadUrls: result.downloadUrls
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Terjadi kesalahan dalam memproses permintaan." });
    }
});

app.get('/api/pin/', async (req, res) => {
    const text = req.query.text;

    if (!text) {
        return res.status(400).json({ error: "Enter Query" });
    }

    try {
        const anutrest = await ptz.pinterest(text); // Dapatkan hasil pencarian dari Pinterest
        let selectedImages = anutrest.slice(0, 5); // Ambil 5 gambar pertama

        // Format respons JSON
        let messages = selectedImages.map(url => ({
            image: url,
            caption: `⭔ Media Url: ${url}`
        }));

        res.json({
            success: true,
            message: '✅ 5 Gambar Pinterest berhasil dikirim!',
            data: messages
        });
    } catch (error) {
        res.status(500).json({ error: "Terjadi kesalahan", details: error.message });
    }
});

app.get('/api/search/tiktoksearch', async (req, res) => {
  const text = req.query.text;  // The search query will be passed in the URL as a query parameter
  
  if (!text) {
    return res.status(400).json({
      error: "Bad Request",
      message: "Please provide a search query. Example: /api/search/tiktoksearch?text=christy+jkt48"
    });
  }

  try {
    const searchResults = await ptz.tiktokSearchVideo(text);
    let result = [];
    let no = 1;

    for (let video of searchResults.videos) {
      let videoData = {
        no: no++,
        title: video.title,
        username: video.author.unique_id,
        nickname: video.author.nickname,
        duration: toRupiah(video.duration) + ' detik',
        like: toRupiah(video.digg_count),
        comment: toRupiah(video.comment_count),
        share: toRupiah(video.share_count),
        url: `https://www.tiktok.com/@${video.author.unique_id}/video/${video.video_id}`,
        video_url: `https://tikwm.com${video.play}`
      };
      
      result.push(videoData);
    }

    // Responding with the JSON data
    res.json({
      searchQuery: text,
      totalResults: result.length,
      results: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Internal Server Error",
      message: `Something went wrong: ${err.message}`
    });
  }
});

app.get('/api/downloader/mediafire', async (req, res) => {
    const url = req.query.url;
    
    if (!url) {
        return res.status(400).json({
            status: false,
            message: "Masukkan URL MediaFire yang valid! Contoh: /api/downloader/mediafire?url=https://www.mediafire.com/file/qyk2na28cidzt3p/cf2.js/file"
        });
    }

    // Validasi format URL MediaFire
    const mediafireRegex = /^(https?:\/\/)?(www\.)?mediafire\.com\/.+$/i;
    if (!mediafireRegex.test(url)) {
        return res.status(400).json({
            status: false,
            message: "URL tidak valid! Pastikan itu adalah URL dari MediaFire."
        });
    }

    try {
        // Menggunakan API pihak ketiga untuk mendapatkan informasi file
        const response = await axios.post('http://kinchan.sytes.net/mediafire/download', { url });
        const result = response.data;

        // Jika terjadi kesalahan dalam pengambilan data
        if (result.error) {
            return res.status(500).json({
                status: false,
                message: result.error
            });
        }

        res.json({
            status: true,
            creator: `${creator}`,
            results: {
                filename: result.filename,
                size: result.size,
                mimetype: result.mimetype,
                downloadUrl: result.download
            }
        });

    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Terjadi kesalahan saat memproses permintaan.",
            error: error.message
        });
    }
});

app.get('/api/stalker/npm', async (req, res) => {
  const text = req.query.package;

  if (!text) {
    return res.status(400).json({
      results: {
        message: `⚠️ Gunakan dengan contoh: ?package=axios`
      }
    });
  }

  try {
    const npmInfo = await ptz.npmstalk(text);
    res.json({
      status: true,
      creator: 'Fajar Official',
      results: {
        Package: npmInfo.name,
        VersiTerbaru: npmInfo.versionLatest,
        WaktuTerbit: npmInfo.publishTime,
        DependenciesTerbaru: npmInfo.latestDependencies
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      results: {
        message: `❌ Ada masalah waktu ambil data dari NPM, Kak! Coba lagi nanti ya 🥺`
      }
    });
  }
});

app.get('/api/game/minecraft', async (req, res) => {
    const host = req.query.host;
    const port = parseInt(req.query.port);

    if (!host) {
        return res.status(400).json({ status: false, message: 'Parameter host Dan Port diperlukan' });
    }

    try {
        const data = await util.status(host, port, { timeout: 2000 });

        res.json({
            status: true,
            results: {
                ip: host,
                port: port,
                ping: data.roundTripLatency,
                motd: data.motd.clean,
                online: data.players.online,
                max: data.players.max,
                version: data.version.name,
                protocol: {
                    version: data.version.protocol,
                    name: data.version.name
                },
                players: data.players.sample || [],
                software: data.software || "Unknown",
                hostname: data.srvRecord?.host || "N/A",
                debug: {
                    query: data.query || false,
                    srv: data.srvRecord ? true : false,
                    cachehit: data.favicon ? true : false
                }
            }
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Gagal mendapatkan data server', error: error.message });
    }
});

app.get('/api/search/playstore', async (req, res) => {
    const nama = req.query.nama;

    if (!nama) {
        return res.json({
            status: false,
            message: 'Nama pencarian tidak diberikan!'
        });
    }

    try {
        const hasil = await ptz.PlayStore(nama);
        if (!hasil || hasil.length === 0 || hasil.message) {
            return res.json({
                status: false,
                message: 'Tidak ditemukan hasil untuk pencarian tersebut.'
            });
        }

        const result = hasil.slice(0, 3).map((item, i) => ({
            rank: i + 1,
            nama: item.nama,
            developer: item.developer,
            rating: item.rate,
            link: item.link,
            link_dev: item.link_dev,
            img: item.img
        }));

        res.json({
            status: true,
            creator: `${creator}`,
            result
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.json({
            status: false,
            message: 'Terjadi kesalahan saat mengambil data dari Play Store.'
        });
    }
});

app.get('/api/search/anime', async (req, res) => {
    const nama = req.query.nama;

    if (!nama) {
        return res.json({
            status: false,
            message: "⚠️ *Judul anime-nya mana?* Coba ketik nama anime yang mau dicari ya!"
        });
    }

    try {
        const anime = await malScraper.getInfoFromName(nama).catch(() => null);

        if (!anime) {
            return res.json({
                status: false,
                message: "❌ *Yahh, anime yang Kakak cari gak ketemu...* 🥺 Coba ketik judul yang lebih spesifik ya!"
            });
        }

        let animeInfo = {
            title: anime.title,
            type: anime.type,
            premiered: anime.premiered || '-',
            episodes: anime.episodes || '-',
            status: anime.status || '-',
            genres: anime.genres || '-',
            studios: anime.studios || '-',
            score: anime.score || '-',
            rating: anime.rating || '-',
            ranked: anime.ranked || '-',
            popularity: anime.popularity || '-',
            trailer: anime.trailer || '-',
            url: anime.url || '-',
            synopsis: anime.synopsis || 'Tidak ada deskripsi tersedia.',
            picture: anime.picture || 'default-image-url'
        };

        res.json({
            status: true,
            creator: `${creator}`,
            result: animeInfo
        });

    } catch (error) {
        res.json({
            status: false,
            message: "❌ Terjadi kesalahan saat mencari data anime. Silakan coba lagi."
        });
    }
});

app.get('/api/stalker/roblox', async (req, res) => {
    const usernameOrId = req.query.userId; // Bisa username atau User ID
    if (!usernameOrId) {
        return res.status(400).json({ status: false, message: 'Parameter "userId" atau username wajib diisi' });
    }

    try {
        const result = await ptz.robloxStalk(usernameOrId);
        if (result.error) {
            return res.status(404).json({ status: false, message: result.error });
        }

        res.json({
            status: true,
            Creator: creator,
            results: result,
        });
    } catch (error) {
        res.status(500).json({ status: false, message: 'Gagal mengambil data pengguna', error });
    }
});

app.get("/api/gpt", async (req, res) => {
const text = req.query.text;

if (!text) {
return res.status(400).send("Parameter 'text' is required.");
}


try {
const requestData = {
operation: "chatExecute",
params: {
text: text,
languageId: "6094f9b4addddd000c04c94b",
toneId: "60572a649bdd4272b8fe358c",
voiceId: ""
}
};

const config = {
headers: {
Accept: "application/json, text/plain, */*",
Authentication: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MTZjMjFhMGE1NTNiNjE1MDhmNWIxOSIsImlhdCI6MTcxMjc2NzUxNH0.qseE0iNl-4bZrpQoB-zxVsc-pz13l3JOKkg4u6Y08OY",
"Content-Type": "application/json"
}
};
let {data} = await axios.post("https://api.rytr.me/", requestData, config)
data.data.content = data.data.content.replace(/<\/?p[^>]*>/g, '');
res.json(data);
} catch (error) {
console.error(error);
res.status(500).send("Internal Server Error");
}
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ada kesalahan pada server');
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
