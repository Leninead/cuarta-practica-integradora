// src/middlewares/checkUserRole.js

const checkUserRole = (requiredRole = 'user') => (req, res, next) => {
    const userRole = req.user.role;
  
    console.log('Required Role:', requiredRole);
    console.log('User Role:', userRole);
  
    if (userRole === requiredRole || userRole === 'admin') {
      return next();
    }
  
    return res.status(403).json({
      message: `Insufficient permissions. Required role: ${requiredRole}, User role: ${userRole}`,
    });
  };
  
  module.exports = checkUserRole;
  