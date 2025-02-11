const axios = require('axios');

const ssweb = (url, device = 'desktop') => {
    return new Promise((resolve, reject) => {
        const base = 'https://www.screenshotmachine.com';
        const param = {
            url: url,
            device: device,
            cacheLimit: 0
        };

        axios({
            url: base + '/capture.php',
            method: 'POST',
            data: new URLSearchParams(Object.entries(param)),
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }).then((response) => {
            const cookies = response.headers['set-cookie'];

            if (response.data.status === 'success') {
                axios.get(`${base}/${response.data.link}`, {
                    headers: {
                        'cookie': cookies.join('')
                    },
                    responseType: 'arraybuffer'
                }).then(({ data }) => {
                    resolve({ status: 200, result: data });
                }).catch(reject);
            } else {
                reject({ status: 404, message: 'Gagal mengambil screenshot', error: response.data });
            }
        }).catch(reject);
    });
};

module.exports = ssweb 
