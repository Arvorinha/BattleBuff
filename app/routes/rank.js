module.exports = function(app){
	app.get("/rankAdm",function(req,res){
		app.app.controller.rank.rankAdm(app,req,res);
	})

	app.post('/alterarRanking',function(req,res){
		app.app.controller.rank.alterarRanking(app,req,res);
	})
}