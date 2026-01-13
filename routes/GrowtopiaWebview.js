const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView');
    });

    app.all('/player/growid/login/validate', (req, res) => {
        const data = decodeURIComponent(req.query.data || '');
        res.send(`{"status":"success","message":"Account Validated.","token":"${data}","url":"","accountType":"growtopia"}`);
    });

    // 🔥 checktoken HARUS all (GET + POST)
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // 🔥 FINAL VALIDATE (IOS SAFE)
    app.all('/player/growid/validate/checktoken', (req, res) => {

        // ambil dari body ATAU query (IOS)
        let refreshToken =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';

        let clientData =
            req.body?.clientData ||
            req.query?.clientData ||
            '';

        if (!refreshToken) {
            return res.send(`{"status":"success","message":"Token is valid.","token":"","url":"","accountType":"growtopia"}`);
        }

        // 🔥 FIX BASE64 IOS
        refreshToken = refreshToken
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        // ❌ JANGAN DECODE / VALIDATE
        // ✔ LANGSUNG BALIK

        res.send(`{
            "status":"success",
            "message":"Token is valid.",
            "token":"${refreshToken}",
            "url":"",
            "accountType":"growtopia"
        }`);
    });
};
