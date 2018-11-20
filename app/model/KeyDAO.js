function KeyDAO(pool){
  this._pool = pool;
}

KeyDAO.prototype.getKeys = function (pagina,min,max,param,cb) {
	this._pool().getConnection(function (err,connection) {
		if (err) {
			throw err
		}
		var options = {sql: "call get_key(?,?,?,?)", nestTables: true};
		connection.query(options,[pagina,min,max,param],cb,connection.release())
	})
};

KeyDAO.prototype.findAll = function (cb) {
  this._pool().getConnection(function (err,connection) {
    if (err) {
      throw err;
    }
    connection.query('SELECT * FROM TB_KEY',cb,connection.release());
  })
};

KeyDAO.prototype.findByKey = function (key,callback) {
  this._pool().getConnection((err,connection) => {
    if (err) {
      return console.log(err);
    }
    connection.query('SELECT * FROM TB_KEY WHERE TX_KEY=?',[key],callback,connection.release());
  })
};

KeyDAO.prototype.insert = function (key,callback) {
  this._pool().getConnection((err,connection) => {
    if (err) {
      return console.log(err);
    }
    connection.query('INSERT INTO TB_KEY(TX_KEY) VALUES(?)',[key],callback,connection.release());
  })
};

KeyDAO.prototype.findByUserNull = function (callback) {
  this._pool().getConnection((err,connection) => {
    if (err) {
      return console.log(err);
    }
    connection.query('SELECT * FROM TB_KEY WHERE BTRID IS NULL',callback,connection.release());
  })
};

KeyDAO.prototype.findByUserNotNull = function (callback) {
  this._pool().getConnection((err,connection) => {
    if (err) {
      return console.log(err);
    }
    // var sql = "SELECT a.TX_KEY, b.BTRID ";
    // sql += "FROM TB_KEY a "
    // sql += "INNER JOIN TB_JOGADOR b ON a.ID_JOGADOR = b.ID_JOGADOR ";
    // sql += "WHERE a.BTRID IS NOT NULL";
    connection.query('SELECT * FROM TB_KEY WHERE BTRID IS NOT NULL',callback,connection.release());
  })
};

KeyDAO.prototype.registerKey = function (id_jogador,key,callback) {
  this._pool().getConnection((err,connection) => {
    if (err) {
      return console.log(err);
    }
    connection.query("UPDATE TB_KEY SET ID_JOGADOR = ? WHERE TX_KEY=? AND ID_JOGADOR IS NULL",[id_jogador,key],callback,connection.release());
  })
};

KeyDAO.prototype.findByBtrid = function (btrid,callback) {
  this._pool().getConnection((err,connection) => {
    if (err) {
      return console.log(err);
    }
    connection.query("SELECT BTRID FROM TB_KEY WHERE BTRID=? AND BTRID IS NOT NULL",[btrid],callback,connection.release());
  })

};

module.exports = function(){
  return KeyDAO;
}
