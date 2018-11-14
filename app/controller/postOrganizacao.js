var fs = require('fs')
var moment = require('moment')
module.exports.post = function(app,req,res) {
  var pool = app.config.dbConnection;
  var oDAO = new app.app.model.OrganizacaoDAO(pool);

  function renderErro(msg,result) {
    var erros = [
      {msg:msg}
    ]
    res.render('admin',{
      session:req.session,
      erros: erros,
      sucesso:'',
      pagina: 'organizacao',
      result: result
    })
  }

  function renderSucesso(msg,result) {
    var sucesso = [
      {msg:msg}
    ]
    res.render('admin',{
      session:req.session,
      sucesso: sucesso,
      erros:'',
      pagina: 'organizacao',
      results: result
    })
  }
  function execGetAll() {
    return new Promise(function(resolve, reject) {
      oDAO.findAll(function(error,results,fields){
        if (error) {
          throw error;
        }
        resolve(results)
        console.log(results);
      })
    });
  }

  req.assert('nome','Nome da organizacao é obrigatório').notEmpty();
  req.assert('nome','Nome da organizacao deve ter entre 2 e 50').len(2,50);

  req.assert('pais','Nome do país é obrigatório').notEmpty();
  req.assert('pais','Nome do deve ter entre 5 e 50').len(2,50);

  var erros = req.validationErrors();

  if (erros) {
    execGetAll().then(function(value){
      return res.render('admin',{
        session:req.session,
        erros: erros,
        sucesso:'',
        pagina: 'organizacao',
        results:value
      })
    })
  }

  if (!req.files.foto) {
    execGetAll().then(function(value){
      renderErro('Foto é obrigatório',value)
    })
    return;
  }

  var imageUploader = new Promise(function(resolve,reject){
    var uploadResult = app.app.controller.fileUploader.fileUploader(app,req,res)
    if (typeof uploadResult == 'undefined') {
      setTimeout(function () {
        if (fs.existsSync('app/views/public/organizacoes/'+req.body.nome+'/')) {
          resolve(true)
        }
        else {
          resolve(false);
        }
      },700)
    }else {
      resolve(uploadResult)
    }
  })

  imageUploader.then(function(value) {
    console.log(value);
    if (value) {
      if (fs.existsSync('app/views/public/organizacoes/'+req.body.nome+'/')) {
        var caminho = 'organizacoes/'+req.body.nome+'/'+req.files.foto.name;
        oDAO.insert(req.body.nome,caminho,req.body.pais,function(error,results,fields) {
          if (error) {
            throw error;
          }
          execGetAll().then(function(value){
            renderSucesso('Órganízacaô incluida com sucesso',value);
          })
          return;
        })
      }
    }else {
      execGetAll().then(function(value) {
        renderErro('Organização já existe',value)
      })
    }
  })
}
