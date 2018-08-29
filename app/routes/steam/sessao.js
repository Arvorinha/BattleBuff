module.exports = function(app){
  app.get('/sessao', function(req,res){
    if(req.session.verificarSessao){
      res.render('sessao', {sessao : req.session.verificarSessao, nick : req.session.nick , steamid : req.session.steamid, btrid : req.session.btrid});
    }else {
      res.redirect('/');
    }
  })
}
