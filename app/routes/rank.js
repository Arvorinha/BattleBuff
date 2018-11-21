module.exports = function(app){
	app.get("/rank",function(req,res){
		app.app.controller.rank.rank(app,req,res);
	})
}
