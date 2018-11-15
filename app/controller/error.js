module.exports.error = function (app,req,res) {
  if (req.session.erros) {
    res.render('error',{
      error:req.session.erros,
      session:req.session
    });
    req.session.destroy();
  }
  else {
    res.redirect('/')
  }
}
