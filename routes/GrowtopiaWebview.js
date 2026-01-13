// importing the necessary modules
const { url } = require('inspector');
const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));
const querystring = require('querystring');

function set(key, newValue, token) {
    try {
        // Pisahkan token berdasarkan pemisah '\\n' untuk mendapatkan data yang lebih akurat
        let dataa = token.split("\\n");

        // Iterasi untuk mencari key yang cocok dan mengganti nilainya
        for (let i = 0; i < dataa.length; i++) {
            if (dataa[i].includes(key)) {
                let tempData = dataa[i].split("|");
                if (tempData[0] === key) {
                    tempData[1] = newValue;
                    dataa[i] = tempData.join("|");
                }
            }
        }
        return dataa.join("\\n");
    } catch (error) {
        console.error("Error in set:", error);
        return token; // Kembalikan token asli jika terjadi kesalahan
    }
}
function get(key, token) {
    try {
        const data = (token.replace(/\n/g, "|")).split("|");
        for (let index = 0; index < data.length; index++) {
            if (data[index] == key) return data[index + 1];
        }
        return ""; // Kembali kosong jika kunci tidak ditemukan
    } catch (error) {
        return ""; // Kembali kosong jika terjadi kesalahan
    }
}
function get2(key, token) {
    try {
        const data = (token.replace(/\\n/g, "|")).split("|");
        for (let index = 0; index < data.length; index++) {
            if (data[index] == key) return data[index + 1];
        }
        return ""; // Kembali kosong jika kunci tidak ditemukan
    } catch (error) {
        return ""; // Kembali kosong jika terjadi kesalahan
    }
}

/**
 * Memparsing query string menjadi objek key-value.
 * @param {string} queryString - Query string (misalnya, username=&pass=).
 * @returns {Object} - Objek key-value hasil parsing.
 */
function parseQuery(queryString) {
    if (!queryString || typeof queryString !== 'string') {
        return {};
    }

    return queryString
        .split('&') // Pisahkan setiap pasangan key=value
        .reduce((acc, pair) => {
            const [key, value] = pair.split('=');
            if (key) {
                acc[key] = value ? decodeURIComponent(value) : ''; // Decode dan handle value kosong
            }
            return acc;
        }, {});
}

// exporting the route function
module.exports = (app) => {
    app.all('/player/login/dashboard', function (req, res) {
        return res.render('growtopia/DashboardView', { cnf: cnf });
    });

    app.all('/player/growid/login/validate', (req, res) => {
        let data = decodeURIComponent(req.query.data);
        
        res.send(`{"status":"success","message":"Account Validated.","token":"${data}","url":"","accountType":"growtopia"}`,);
    });

    app.all('/player/growid/checktoken', (req, res) => {
    res.redirect(307, '/player/growid/validate/checktoken');
});
    app.all('/player/growid/validate/checktoken', (req, res) => {
    const refreshToken = req.body.refreshToken;
    const clientData = req.body.clientData;

    if (!refreshToken || !clientData) {
        return res.send(`{"status":"failed","message":"Invalid token.","token":"","url":"","accountType":"growtopia"}`);
    }

    // decode (dummy, sesuai penjelasan kamu)
    const decoded = Buffer.from(refreshToken, 'base64').toString();

    if (!decoded.includes("growId=")) {
        return res.send(`{"status":"failed","message":"Token invalid.","token":"","url":"","accountType":"growtopia"}`);
    }

    // refresh token
    const newToken = Buffer.from(decoded).toString('base64');

    res.send(`{"status":"success","message":"Token is valid.","token":"${newToken}","url":"","accountType":"growtopia"}`);
});
};
