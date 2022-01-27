let NeDB = require('nedb');
let db = new NeDB({
    filename: 'users.db',
    autoload: true
});
const {check} = require("express-validator");

module.exports = app => {
    let route = app.route('/users');

    route.get((req, res) => {
        db.find({}).sort({name: 1}).exec((err, users) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json({
                    users
                });
            }
        });
    });

    route.post(
        [
            check("name", "O nome é obrigatório.").notEmpty(),
            check("email", "Email inválido.").notEmpty().isEmail(),
        ],
        (req, res) => {
            if (!app.utils.validator.user(app, req, res)) {
                return false;
            }

            db.insert(req.body, (err, user) => {
                if (err) {
                    app.utils.error.send(err, req, res);
                } else {
                    res.status(200).json(user);
                }
            });
        });

    let routeAdmin = app.route('/users/admin');
    routeAdmin.get((req, res) => {
        db.find({admin: 'true'}).exec((err, users) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json({
                    users
                });
            }
        });
    });

    let routeId = app.route('/users/:id');
    routeId.get((req, res) => {
        db.findOne({_id: req.params.id}).exec((err, users) => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json({
                    users
                });
            }
        });
    });

    routeId.put(
        [
            check("name", "O nome é obrigatório.").notEmpty(),
            check("email", "Email inválido.").notEmpty().isEmail(),
        ],
        (req, res) => {
            if (!app.utils.validator.user(app, req, res)) {
                return false;
            }
            db.update({_id: req.params.id}, req.body, err => {
                if (err) {
                    app.utils.error.send(err, req, res);
                } else {
                    res.status(200).json(Object.assign({}, req.body, req.params));
                }
            });
        });

    routeId.delete((req, res) => {
        db.remove({_id: req.params.id}, {}, err => {
            if (err) {
                app.utils.error.send(err, req, res);
            } else {
                res.status(200).json(req.params);
            }
        });
    });
};