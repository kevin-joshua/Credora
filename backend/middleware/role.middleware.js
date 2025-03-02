export const roleMiddleware = async(req, res, next) => {
  if(!req.user || req.user.role !== "Admin"){
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}