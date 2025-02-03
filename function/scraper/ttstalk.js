const axios = require('axios');
const cheerio = require('cheerio');

async function tiktokStalk(username) {
    try {
        const response = await axios.get(`https://www.tiktok.com/@${username}?_t=ZS-8tHANz7ieoS&_r=1`);
        const html = response.data;
        const $ = cheerio.load(html);
        const scriptData = $('#__UNIVERSAL_DATA_FOR_REHYDRATION__').html();
        const parsedData = JSON.parse(scriptData);

        const userDetail = parsedData.__DEFAULT_SCOPE__?.['webapp.user-detail'];
        if (!userDetail) {
            throw new Error('User tidak ditemukan');
        }

        const userInfo = userDetail.userInfo?.user;
        const stats = userDetail.userInfo?.stats;

        const metadata = {
    userInfo: {
        id: userInfo?.id || null,
        username: "Username: " + (userInfo?.uniqueId || '') + " ",
        nama: "Nama: " + (userInfo?.nickname || '') + " ",
        avatar: "Avatar: " + (userInfo?.avatarLarger || '') + " ",
        bio: "Bio: " + (userInfo?.signature || '') + " ",
        verifikasi: "Verifikasi: " + (userInfo?.verified ? "True" : "False") + " ",
        totalfollowers: "Total Followers: " + (stats?.followerCount || 0) + " ",
        totalmengikuti: "Total Mengikuti: " + (stats?.followingCount || 0) + " ",
        totaldisukai: "Total Disukai: " + (stats?.heart || 0) + " ",
        totalvideo: "Total Video: " + (stats?.videoCount || 0) + " ",
        totalteman: "Total Teman: " + (stats?.friendCount || 0) + " "
    }
};

        return metadata;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = tiktokStalk;
