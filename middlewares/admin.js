//  after authenticating a user, check for whether user is an admin
function isAdmin(req, res, next) {
  if (!req.user.is_admin)
    return res.status(403).send("Access Denied. Forbidden.");

  next();
}
module.exports = isAdmin;
