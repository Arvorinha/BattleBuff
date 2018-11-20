var fs = require('fs')
var moment = require('moment')
module.exports.post = function(app,req,res) {
  var pool = app.config.dbConnection;
  var oDAO = new app.app.model.OrganizacaoDAO(pool);
  var minPagina = 0;
  var numPage = 0;
  if (req.query.pagina == 1 || !req.query.pagina) {
    var paginaAtual = 1;
  }else {
    paginaAtual = req.query.pagina
  }
  if (paginaAtual>1) {
    var minPagina = 5*(paginaAtual-1);
  }

  function execGetAll() {
    return new Promise(function(resolve, reject) {
      oDAO.findAll(function(error,results,fields){
        if (error) {
          throw error;
        }
        resolve(results)
      })
    });
  }

  execGetAll().then(function(value){
    numPage = Math.ceil(value.length/5);
  })

  function renderErro(msg,result) {
    var erros = [
      {msg:msg}
    ]
    res.render('admin',{
      session:req.session,
      erros: erros,
      sucesso:'',
      pagina: 'organizacao',
      results: result,
      numPagina: numPage,
      pageAtual: paginaAtual
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
      results: result,
      numPagina: numPage,
      pageAtual: paginaAtual
    })
  }

  function findByPaginacaoOrganizacao() {
    return new Promise(function (resolve,reject) {
      oDAO.findByPaginacao(minPagina,function (error,results,fields) {
        if (error) {
          throw error;
        }
        resolve(results)
      })
    })
  }

  req.assert('nome','Nome da organizacao é obrigatório').notEmpty();
  req.assert('nome','Nome da organizacao deve ter entre 2 e 50').len(2,50);

  req.assert('pais','Nome do país é obrigatório').notEmpty();
  req.assert('pais','Nome do deve ter entre 5 e 50').len(2,50);

  var erros = req.validationErrors();

  if (erros) {
    findByPaginacaoOrganizacao().then(function(value){
      return res.render('admin',{
        session:req.session,
        erros: erros,
        sucesso:'',
        pagina: 'organizacao',
        results:value,
        numPagina: numPage,
        pageAtual: paginaAtual
      })
    })
  }

  if (!req.files.foto) {
    findByPaginacaoOrganizacao().then(function(value){
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
            numPage = Math.ceil(value.length/5);
          })
          findByPaginacaoOrganizacao().then(function(value){
            renderSucesso('Órganízacaô incluida com sucesso',value);
          })
          return;
        })
      }
    }else {
      findByPaginacaoOrganizacao().then(function(value) {
        renderErro('Organização já existe',value)
      })
    }
  })
}
