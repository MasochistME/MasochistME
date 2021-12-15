export const tokenValidation = (req: any, res: any, next) => {
  const auhorizationHeader = req.headers.authorization;

  if (!auhorizationHeader) {
    return res.status(401).json({
      error: true,
      message: 'Access token is missing',
    });
  }

  next();
};
