const axios = require('axios');
const cheerio = require('cheerio');

async function mediafire(query) {
  return new Promise((resolve, reject) => {
    axios.get(query)
      .then(({ data }) => {
        const $ = cheerio.load(data);
        const judul = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-btn-cont > div.dl-btn-labelWrap > div.promoDownloadName.notranslate > div').text();
        const size = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(1) > span').text();
        const upload_date = $('body > div.mf-dlr.page.ads-alternate > div.content > div.center > div > div.dl-info > ul > li:nth-child(2) > span').text();
        const link = $('#downloadButton').attr('href');
        
        const result = {
          judul: link.split('/')[5],
          upload_date: upload_date,
          size: size,
          mime: link.split('/')[5].split('.')[1],
          link: link
        };
        resolve(result);
      })
      .catch(reject);
  });
}

module.exports = mediafire;
