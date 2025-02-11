const cloudscraper = require('cloudscraper');

// Fungsi untuk mendapatkan User ID dari Username
async function getUserId(username) {
    const url = `https://users.roblox.com/v1/usernames/users`;
    const payload = { usernames: [username], excludeBannedUsers: true };

    try {
        const response = await cloudscraper.post(url, { json: payload });
        const data = response.data;
        return data.data.length > 0 ? data.data[0].id : null;
    } catch {
        return null;
    }
}

// Fungsi untuk mendapatkan informasi pengguna
async function getUserInfo(userId) {
    const url = `https://users.roblox.com/v1/users/${userId}`;
    try {
        const response = await cloudscraper.get(url);
        return JSON.parse(response);
    } catch {
        return null;
    }
}

// Fungsi untuk mendapatkan akun sosial pengguna
async function getUserSocials(userId) {
    const url = `https://users.roblox.com/v1/users/${userId}/social`;
    try {
        const response = await cloudscraper.get(url);
        return JSON.parse(response);
    } catch {
        return null;
    }
}

// Fungsi untuk mendapatkan inventory pengguna
async function getUserInventory(userId) {
    const url = `https://inventory.roblox.com/v1/users/${userId}/inventory`;
    try {
        const response = await cloudscraper.get(url);
        return JSON.parse(response);
    } catch {
        return null;
    }
}

// Fungsi untuk mendapatkan status kehadiran pengguna (online/offline)
async function getUserPresence(userId) {
    const url = "https://presence.roblox.com/v1/presence/users";
    const payload = { userIds: [userId] };
    try {
        const response = await cloudscraper.post(url, { json: payload });
        return JSON.parse(response);
    } catch {
        return null;
    }
}

// Fungsi untuk mendapatkan grup pengguna
async function getUserGroups(userId) {
    const url = `https://groups.roblox.com/v1/users/${userId}/groups/roles`;
    try {
        const response = await cloudscraper.get(url);
        return JSON.parse(response);
    } catch {
        return null;
    }
}

// Fungsi utama untuk menggabungkan semua data
async function robloxStalk(usernameOrId) {
    let userId = usernameOrId;

    // Jika input adalah username, ubah ke userId
    if (isNaN(usernameOrId)) {
        userId = await getUserId(usernameOrId);
        if (!userId) return { error: 'Username tidak ditemukan' };
    }

    // Ambil semua data
    const userInfo = await getUserInfo(userId);
    const userSocials = await getUserSocials(userId);
    const userInventory = await getUserInventory(userId);
    const userPresence = await getUserPresence(userId);
    const userGroups = await getUserGroups(userId);

    return {
        userInfo,
        userSocials,
        userInventory,
        userPresence,
        userGroups,
    };
}

module.exports = robloxStalk
