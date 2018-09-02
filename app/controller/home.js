module.exports.index = function(app, req ,res){
  if(req.session.verificarSessao){
    if (typeof req.query.sair != "undefined" && req.query.sair == "sim") {
      console.log(req.query.sair);
      delete req.session.steamid;
      delete req.session.verificarSessao;
      delete req.session.nick;
      delete req.session.btrid;
      delete req.session.img;
      res.redirect('/')
    }
    else {
      res.render('index', {sessao : req.session.verificarSessao, nick : req.session.nick , steamid : req.session.steamid, btrid : req.session.btrid, img : req.session.img});
    }
  }else {
    res.render('index');
  }
}
