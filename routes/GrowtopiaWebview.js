const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));
const querystring = require('querystring');

module.exports = (app) => {

    /* =========================
       1️⃣ DASHBOARD
    ========================= */
    app.all('/player/login/dashboard', (req, res) => {

        // client data (optional)
        const clientData = querystring.stringify(req.body || {});
        const encodedClientData = Buffer.from(clientData).toString('base64');

        res.render('growtopia/DashboardView', {
            cnf,
            _token: encodedClientData
        });
    });

    /* =========================
       2️⃣ LOGIN VALIDATE
    ========================= */
    app.post('/player/growid/login/validate', (req, res) => {

        const { _token, growId, password } = req.body;

        // gabungkan SESUAI SPEC
        const credentialString =
            `_token=${_token}&growId=${growId}&password=${password}`;

        const encodedCredentials =
            Buffer.from(credentialString).toString('base64');

        res.json({
            status: "success",
            message: "Account Validated.",
            token: encodedCredentials,
            url: "",
            accountType: "growtopia"
        });
    });

    /* =========================
       4️⃣ CHECKTOKEN (REDIRECT)
    ========================= */
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    /* =========================
       5️⃣ VALIDATE CHECKTOKEN
    ========================= */
    app.all('/player/growid/validate/checktoken', (req, res) => {

        let refreshToken =
            req.body?.refreshToken ||
            req.query?.refreshToken ||
            '';

        // iOS fix (base64 safety)
        refreshToken = refreshToken
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        // BALIK APA ADANYA
        res.json({
            status: "success",
            message: "Token is valid.",
            token: refreshToken,
            url: "",
            accountType: "growtopia"
        });
    });
};
