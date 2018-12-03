module.exports = function(app){
	app.get("/perfil/:btrid",function(req,res){
		app.app.controller.perfil.perfil(app,req,res);
	})
}
