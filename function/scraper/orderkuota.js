require("../settings.js");
const axios = require("axios");

class OrderKuota {
    constructor() {
        this.apitoken = global.apiOrderKuota;
        this.urlQris = global.qrisOrderKuota;
        this.merchantId = global.merchantIdOrderKuota;
    }

    // Fungsi untuk membuat pembayaran QRIS
    async createPayment(amount) {
        try {
            const response = await axios.get(`https://gateway.elevate.web.id/api/orkut/createpayment`, {
                params: {
                    amount: amount,
                    urlqris: this.urlQris
                }
            });

            if (response.status !== 200) throw new Error("Gagal membuat pembayaran");

            // Ambil data dari respons API
            const paymentData = response.data.results;

            return {
                success: true,
                transaction_id: paymentData.transaction_id,
                amount: paymentData.amount,
                currency: paymentData.currency,
                payment_status: paymentData.payment_status,
                qris_url: paymentData.qris_url,
                qris_image: paymentData.qris_image,
                created_at: paymentData.created_at,
                expired_at: paymentData.expired_at,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Terjadi kesalahan saat membuat pembayaran",
            };
        }
    }

    // Fungsi untuk mengecek status pembayaran
    async cekStatus(transactionId) {
        try {
            const response = await axios.get(`https://gateway.elevate.web.id/api/orkut/cekstatus`, {
                params: {
                    merchant: this.merchantId,
                    keyorkut: this.apitoken,
                    transaction_id: transactionId
                }
            });

            if (response.status !== 200) throw new Error("Gagal mengecek status pembayaran");

            return {
                success: true,
                transaction_id: response.data.transaction_id,
                status: response.data.status,
                updated_at: response.data.updated_at,
            };
        } catch (error) {
            return {
                success: false,
                message: error.message || "Terjadi kesalahan saat mengecek status",
            };
        }
    }
}

module.exports = { OrderKuota };
