module.exports.rankAdm = function(app,req,res){
	/*if (!req.session.autenticado) {
		return res.redirect('/');
	}*/
	console.log(req.session);
	res.render("rankAdm",{
		session:req.session,
		erros:{},
		sucesso: {}
	});
}

module.exports.alterarRanking = function (app,req,res){
	req.assert('season','O campo é obrigatorio').notEmpty();
	req.assert('season','O campo deve ter entre 8 e 20').len(8,20);

	var erros = req.validationErrors();
	var dadosForm = {
		form:req.body
	}
	if(erros){
		erros.push(dadosForm);
		console.log(erros[2].form.season);
		res.render('rankAdm',{
			session:req.session,
			erros:erros,
			sucesso: {}
		});
		return;
	}

	function renderErro(erro) {
		var erros =[
			{msg:erro},
			dadosForm
		]
		res.render('rankAdm',{
			session:req.session,
			erros: erros,
			sucesso: {}
		});
	}

	function renderSucesso(sucesso) {
		res.render('rankAdm',{
			session:req.session,
			erros: {},
			sucesso: [{msg:sucesso}]
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
