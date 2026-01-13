const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

function parseQuery(str) {
    if (!str || typeof str !== 'string') return {};
    return str.split('&').reduce((a, p) => {
        const [k, v] = p.split('=');
        if (k) a[k] = decodeURIComponent(v || '');
        return a;
    }, {});
}

function getBody(req) {
    if (req.body && Object.keys(req.body).length) return req.body;
    if (typeof req.body === 'string') return parseQuery(req.body);
    if (req.query && Object.keys(req.query).length) return req.query;
    return {};
}

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    // LOGIN VALIDATE (dummy)
    app.all('/player/growid/login/validate', (req, res) => {
        const data = decodeURIComponent(req.query.data || '');
        res.send(`{"status":"success","message":"Account Validated.","token":"${data}","url":"","accountType":"growtopia"}`);
    });

    // ✅ CHECKTOKEN (NO REDIRECT, NO RAW MIDDLEWARE)
    app.all('/player/growid/checktoken', (req, res) => {

        const body = getBody(req);

        const refreshToken = body.refreshToken;
        const clientData   = body.clientData;

        if (!refreshToken || !clientData) {
            return res.send(`{"status":"failed","message":"Invalid token.","token":"","url":"","accountType":"growtopia"}`);
        }

        let decoded;
        try {
            decoded = Buffer.from(refreshToken, 'base64').toString();
        } catch {
            return res.send(`{"status":"failed","message":"Bad token.","token":"","url":"","accountType":"growtopia"}`);
        }

        const newToken = Buffer.from(decoded).toString('base64');

        res.send(`{"status":"success","message":"Token is valid.","token":"${newToken}","url":"","accountType":"growtopia"}`);
    });

    // fallback (optional)
    app.all('/player/growid/validate/checktoken', (req, res) => {
        const body = getBody(req);
        const refreshToken = body.refreshToken;

        if (!refreshToken) {
            return res.send(`{"status":"failed","message":"Invalid token.","token":"","url":"","accountType":"growtopia"}`);
        }

        const decoded = Buffer.from(refreshToken, 'base64').toString();
        const newToken = Buffer.from(decoded).toString('base64');

        res.send(`{"status":"success","message":"Token is valid.","token":"${newToken}","url":"","accountType":"growtopia"}`);
    });
};
