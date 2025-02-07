require('./settings.js')
var express = require("express"), cors = require("cors"), secure = require("ssl-express-www");
const path = require('path');
const os = require('os');
const fs = require('fs');
const ptz = require('./function/index') 
const axios = require('axios')
const isUrl = require("is-url")
const cheerio = require('cheerio');
const scr = require('@bochilteam/scraper')

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

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.get('/api/samp', async (req, res) => {
    const { ip, port } = req.query;

    if (!ip || !port) {
        return res.status(400).json({ error: "Harap sertakan IP dan port dalam permintaan." });
    }

    try {
        const serverStatus = await ptz.getServerStatus(ip, port);
        if (serverStatus) {
            res.json(serverStatus);
        } else {
            res.status(503).json({ message: "Server sedang offline/MT." });
        }
    } catch (error) {
        console.error("Error handling request:", error);
        res.status(500).json({ error: "Terjadi kesalahan saat menghubungi server." });
    }
});

app.get('/api/ragbot', async (req, res) => {
  try {
    const message = req.query.message;
    if (!message) {
      return res.status(400).json({ error: 'Parameter "message" tidak ditemukan' });
    }
    const response = await ptz.ragBot(message);
    res.status(200).json({
      status: 200,
      creator: "Fajar Official",
      data: { response }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  if (!text) return res.status(400).json({ error: "Text is required." });

  try {
    const response = await axios.get(`https://api.siputzx.my.id/api/tools/translate`, {
      params: { text: text, source: "auto", target: "id" }
    });
    res.json({ status: true, creator: "Fajar Official", result: response.data.translatedText });
  } catch {
    res.status(500).json({ error: "An error occurred while processing the translation." });
  }
});

app.get("/api/ytmp3", async (req, res) => {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "Url is required." });

    try {
        const response = await axios.get(`https://api.siputzx.my.id/api/d/youtube?q=${url}`);
        const data = response.data;

        res.json({
            status: true,
            creator: "Fajar Official",
            result: {
                Judul: data.data.title,
                thumbnail: data.data.thumbnailUrl,
                durasi: data.data.duration,
                UrlDownload: data.data.sounds
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching data." });
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

router.get('/search/pinterest', async (req, res, next) => {
    var text = req.query.query
    if (!text) return res.json({
        status: false,
        creator: `${creator}`,
        message: "masukan parameter query"
    })
    scr.pinterest(text)
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
})

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


app.use((req, res, next) => {
  res.status(404).send("Halaman tidak ditemukan");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ada kesalahan pada server');
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
