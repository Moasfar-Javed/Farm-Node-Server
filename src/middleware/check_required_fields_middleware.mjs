const checkRequiredFieldsMiddleware = (requiredFields) => (req, res, next) => {
  const missingFields = requiredFields.filter(
    (field) => !(field in req.body || field in req.query)
  );

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      data: {},
      message: `Missing the fields: ${missingFields.join(", ")}`,
    });
  }

  next();
};

export default checkRequiredFieldsMiddleware;
