const axios = require('axios');
const cheerio = require('cheerio');

async function mediafire(query) {
  return new Promise((resolve, reject) => {
    axios.get(query, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const judul = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').text().trim();
        const size = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(1) > span').text().trim();
        const upload_date = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text().trim();
        const link = $('#downloadButton').attr('href');

        // Check for missing data
        if (!judul || !size || !upload_date || !link) {
          return reject(new Error('Missing data or incorrect structure'));
        }

        const result = {
          judul: judul,
          upload_date: upload_date,
          size: size,
          mime: link.split('/')[5].split('.')[1],
          link: link
        };
        resolve(result);
      })
      .catch(error => {
        console.error('Error during scraping:', error);
        reject(new Error('Failed to scrape MediaFire page'));
      });
  });
}

module.exports = mediafire;
