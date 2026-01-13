const path = require('path');
const cnf = require(path.join(__dirname, '..', 'Config.js'));

module.exports = (app) => {

    app.all('/player/login/dashboard', (req, res) => {
        res.render('growtopia/DashboardView', { cnf });
    });

    app.all('/player/growid/login/validate', (req, res) => {
        const data = decodeURIComponent(req.query.data || '');
        res.send(
            `{"status":"success","message":"Account Validated.","token":"${data}","url":"","accountType":"growtopia"}`
        );
    });

    // STEP 1: REDIRECT (WAJIB)
    app.all('/player/growid/checktoken', (req, res) => {
        res.redirect(307, '/player/growid/validate/checktoken');
    });

    // STEP 2: CHECKTOKEN (STATELESS, IOS SAFE)
    app.all('/player/growid/validate/checktoken', (req, res) => {

        let refreshToken =
            (req.body && req.body.refreshToken) ||
            (req.query && req.query.refreshToken) ||
            '';

        refreshToken = refreshToken
            .replace(/ /g, '+')
            .replace(/\n/g, '');

        res.send(
            `{"status":"success","message":"Token is valid.","token":"${refreshToken}","url":"","accountType":"growtopia"}`
        );
    });
};
