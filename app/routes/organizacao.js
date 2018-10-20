module.exports = function(app){
  app.get('/organizacao',(req,res)=>{
    app.app.controller.organizacao.organizacao(app,req,res);
  })

  app.post('/postOrganizacao',(req,res)=>{
    app.app.controller.organizacao.postOrganizacao(app,req,res);
  })
}
