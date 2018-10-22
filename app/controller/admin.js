module.exports.admin = function(app,req,res){
  res.render('admin',{
    erros:'',
    sucesso: '',
    pagina:'',
    session: req.session
  })
}

module.exports.pagina = function(app,req,res){
  function render(pagina) {
    res.render('admin',{
      erros:'',
      sucesso: '',
      pagina:pagina,
      session: req.session
    })
  }

  function renderErro(erro) {
    res.render('admin',{
      erros: [{msg:erro}],
      pagina: '',
      sucesso: '',
      session:req.session
    })
  }
  switch (req.params.pagina) {
    case 'season':render(req.params.pagina);
      break;
    case 'organizacao':render(req.params.pagina);
      break;
    case 'a':render(req.params.pagina);
      break;
    default:render('inexistente');
      break;

  }
}

module.exports.postOrganizacao = function(app,req,res) {
  function renderErro(msg) {
    var erros = [
      {msg:msg}
    ]
    res.render('admin',{
      session:req.session,
      erros: erros,
      sucesso:'',
      pagina: 'organizacao'
    })
  }

  function renderSucesso(msg) {
    var sucesso = [
      {msg:msg}
    ]
    res.render('admin',{
      session:req.session,
      sucesso: sucesso,
      erros:'',
      pagina: 'organizacao'
    })
  }

  req.assert('nome','Nome da organizacao é obrigatório').notEmpty();
  req.assert('nome','Nome da organizacao deve ter entre 2 e 50').len(2,50);

  req.assert('pais','Nome do país é obrigatório').notEmpty();
  req.assert('pais','Nome do deve ter entre 5 e 50').len(2,50);

  var erros = req.validationErrors();

  if (erros) {
    return res.render('admin',{
      session:req.session,
      erros: erros,
      sucesso:'',
      pagina: 'organizacao'
    })
  }

  if (!req.files.foto) {
    renderErro('Foto é obrigatório')
    return;
  }

  var imageUploader = app.app.controller.fileUploader.fileUploader(app,req,res);

  if (imageUploader) {
    renderSucesso('Organizacao incluida com sucesso');
  }

}

module.exports.alterarRanking = function (app,req,res){
	req.assert('season','O campo é obrigatorio').notEmpty();
	req.assert('season','O campo deve ter entre 8 e 20').len(8,20);

	var erros = req.validationErrors();
	var dadosForm = {
		form:req.body
	}
	if(erros){
		res.render('admin',{
			session:req.session,
			erros:erros,
			sucesso: ' ',
      pagina: 'season'
		});
		return;
	}

	function renderErro(erro) {
		var erros =[
			{msg:erro},
			dadosForm
		]
		res.render('admin',{
			session:req.session,
			erros: erros,
			sucesso: '',
      pagina : 'season'
		});
	}

	function renderSucesso(sucesso) {
		res.render('admin',{
			session:req.session,
			erros: '',
			sucesso: [{msg:sucesso}],
      pagina: 'season'
		});
	}

	var pool = app.config.dbConnection;
	var sDAO = new app.app.model.SeasonDAO(pool);
	var seasonNova = req.body.season;

	sDAO.findBySeason(seasonNova,function(err,result){
		if (err) {
			throw err;
		}
		if (result.rowCount > 0) {
			console.log(result);
			renderErro('Já existe uma season com esse nome');
			return;
		}
		sDAO.insert(seasonNova,function(err,result){
			if (err) {
				throw err;
			}
			if (result.rowCount > 0) {
				renderSucesso('Nova season registrada com sucesso');
				return;
			}else {
				console.error(result);
				renderErro('Ocorreu algum erro, verifique o log do servidor ou contade algum adm');
				return;
			}
		})
	})
}
