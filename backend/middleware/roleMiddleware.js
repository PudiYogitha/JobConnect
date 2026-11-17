export default function roleMiddleware(...allowedRoles) {
  return (req, res, next) => allowedRoles.includes(req.user.role)
    ? next()
    : res.status(403).json({ message: 'You do not have permission for this action' });
}
