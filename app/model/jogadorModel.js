module.exports = function(){
  this.findAll = function(pool,callback){
    pool().connect((err, client, done) => {
      if(err) throw(err);
      client.query('SELECT * FROM TB_JOGADOR', callback);
    });
  }

  this.findBySteam64 = function(id,pool,callback){
    pool().connect((err, client,done) => {
      if (err) {
        throw err;
      }
      client.query('SELECT * FROM TB_JOGADOR WHERE STEAM64= $1',[id],callback);
    });
  }

  this.insert = function(STEAM64, BTRID, pool, callback){
    pool().connect((err, client, done) => {
      if(err){
        throw err;
      }
      let command = 'INSERT INTO TB_JOGADOR(STEAM64, BTRID) VALUES($1, $2)';
      let values = [STEAM64, BTRID];
      client.query(command,values, callback);
    })
  }

  this.update = function(STEAM64,NM_JOGADOR,CAMINHO_IMG, pool, callback){
    pool().connect((err, client, done) => {
      if (err) {
        throw err;
      }
      let command = 'UPDATE TB_JOGADOR SET NM_JOGADOR=$1,STEAM64=$2,CAMINHO_IMG=$3 WHERE STEAM64=$2';
      let values = [NM_JOGADOR,STEAM64,CAMINHO_IMG];
      client.query(command,values, callback);
    });
  }

  return this;
}
