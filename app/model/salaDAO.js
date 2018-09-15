function salaDAO(pool){
  this._pool = pool;
}

salaDAO.prototype.insert = function (nome,callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('INSERT INTO TB_SALA(NOME) VALUES($1) RETURNING id',[nome],callback);
  })
};

module.exports = function(){
  return salaDAO;
}
