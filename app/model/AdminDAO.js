function AdminDAO(pool){
  this._pool = pool;
}

AdminDAO.prototype.findById = function (id,callback) {
  this._pool().getConnection((err,connection) => {
    if (err) {
      return console.log(err);
    }
    connection.query('SELECT * FROM TB_ADMIN WHERE ID_JOGADOR = ?',[id],callback,connection.release())
  })
};

module.exports = function(){
  return AdminDAO;
}
