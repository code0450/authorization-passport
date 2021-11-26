export function authCheck(req, res, next) {
    if(req.isAuthenticated()) return next();
    res.redirect('/login')
}