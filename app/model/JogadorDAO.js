function JogadorDAO(pool){
  this._pool = pool;
}

JogadorDAO.prototype.findAll = function(callback){
  this._pool().connect((err, client, done) => {
    if(err){
      console.log(err);
      return
    }
    client.query('SELECT * FROM TB_JOGADOR', callback,done());
  });
}

JogadorDAO.prototype.findBySteam64 = function(id,callback){
  this._pool().connect((err, client,done) => {
    if(err){
      console.log(err);
      return
    }
    client.query('SELECT * FROM TB_JOGADOR WHERE STEAM64= $1',[id],callback,done());
  });
}

JogadorDAO.prototype.insert = function(STEAM64, BTRID, callback){
  this._pool().connect((err, client, done) => {
    if(err){
      console.log(err);
      return
    }
    let command = 'INSERT INTO TB_JOGADOR(STEAM64, BTRID) VALUES($1, $2)';
    let values = [STEAM64, BTRID];
    client.query(command,values, callback,done());
  })
}

JogadorDAO.prototype.update = function(STEAM64,NM_JOGADOR,CAMINHO_IMG, callback){
  this._pool().connect((err, client, done) => {
    if(err){
      console.log(err);
      return
    }
    let command = 'UPDATE TB_JOGADOR SET NM_JOGADOR=$1,STEAM64=$2,CAMINHO_IMG=$3 WHERE STEAM64=$2';
    let values = [NM_JOGADOR,STEAM64,CAMINHO_IMG];
    client.query(command,values, callback,done());
  });
}

JogadorDAO.prototype.updateMmr = function(cb){
  this._pool().connect((err,client,done)=>{
    if (err) {
      throw err
    }
    client.query('UPDATE TB_JOGADOR SET MMR_JOGADOR = 100',cb,done());
  })
}

module.exports = function(){
  return JogadorDAO;
}
