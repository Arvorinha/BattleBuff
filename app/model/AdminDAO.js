function AdminDAO(pool){
  this._pool = pool;
}

AdminDAO.prototype.findById = function (id,callback) {
  this._pool().connect((err,client,done) => {
    if (err) {
      throw err;
    }
    client.query('SELECT * FROM TB_ADMIN WHERE ID_JOGADOR = $1',[id],callback)
  })
};

module.exports = function(){
  return AdminDAO;
}
