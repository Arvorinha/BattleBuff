module.exports = function (app) {
  app.get('/error',function (req,res) {
    app.app.controller.error.error(app,req,res);
  })
}
