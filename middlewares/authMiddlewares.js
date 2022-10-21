const authMiddlewares = {
  checkIsExist: (model, condition) => async (req, res, next) => {
    const isExist = await model.findOne(condition);
  },
};
