const cloudscraper = require('cloudscraper');

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
async function robloxStalk(userId) {
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
