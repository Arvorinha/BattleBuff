module.exports.organizacao = function(app,req,res){
  res.render('organizacao',{
    sessao:req.session,
    erros: {},
    sucesso:{}
  })
}

module.exports.postOrganizacao = function(app,req,res) {
  function renderErro(msg) {
    var erros = [
      {msg:msg}
    ]
    res.render('organizacao',{
      sessao:req.session,
      erros: erros,
      sucesso:{}
    })
  }

  function renderSucesso(msg) {
    var sucesso = [
      {msg:msg}
    ]
    res.render('organizacao',{
      sessao:req.session,
      sucesso: sucesso,
      erros:{}
    })
  }

  req.assert('nome','Nome da organizacao é obrigatório').notEmpty();
  req.assert('nome','Nome da organizacao deve ter entre 2 e 50').len(2,50);

  req.assert('pais','Nome do país é obrigatório').notEmpty();
  req.assert('pais','Nome do deve ter entre 5 e 50').len(2,50);

  if (!req.files.foto) {
    renderErro('Foto é obrigatório')
    return;
  }

  var erros = req.validationErrors();

  if (erros) {
    return res.render('organizacao',{
      sessao:req.session,
      erros: erros,
      sucesso:''
    })
  }

  var imageUploader = app.app.controller.fileUploader.fileUploader(app,req,res);

  if (imageUploader) {
    renderSucesso('Organizacao incluida com sucesso');
  }

}
