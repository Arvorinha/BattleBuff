module.exports = function(app){
  app.get('/sessao', function(req,res){
    if(req.session.verificarSessao){
      if (typeof req.query.sair != "undefined" && req.query.sair == "sim") {
        console.log(req.query.sair);
        delete req.session.steamid;
        delete req.session.verificarSessao;
        delete req.session.nick;
        delete req.session.btrid;
        res.redirect('/')
      }
      else {
        res.render('sessao', {sessao : req.session.verificarSessao, nick : req.session.nick , steamid : req.session.steamid, btrid : req.session.btrid});
      }
    }else {
      res.redirect('/');
    }
  })
}
