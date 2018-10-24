var fs = require('fs');
module.exports.fileUploader = function(app,req,res){
  function saveArquivo(){
    var nomeArquivo = "";
    switch (req.files.foto.mimetype) {
      case "image/png":
      nomeArquivo = req.files.foto.name;
      break;
      case "image/jpeg":
      nomeArquivo = req.files.foto.name;
      break;
      case "image/jpg":
      nomeArquivo = req.files.foto.name;
      break;
      case "image/gif":
      nomeArquivo = req.files.foto.name;
      break;
      default: nomeArquivo = ""; break;

    }
    if (nomeArquivo) {
      req.files.foto.mv('app/views/public/organizacoes/'+req.body.nome+'/'+nomeArquivo,function(err){
        if (err) {
          throw err;
        }
      })
      return true;
    }
  }

  if (!fs.existsSync('app/views/public/organizacoes/'+req.body.nome+'/')) {
    if (!fs.existsSync('app/views/public/organizacoes/')) {
      fs.mkdir('app/views/public/organizacoes/',function(err){
        if (err) {
          throw err;
        }
        fs.mkdirSync('app/views/public/organizacoes/'+req.body.nome+'/');
        return saveArquivo();
      });
    }
    else {
      fs.mkdirSync('app/views/public/organizacoes/'+req.body.nome+'/');
      return saveArquivo();
    }
  }
  else {
    return false;
  }
}
