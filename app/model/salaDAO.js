function salaDAO(pool) {
  this._pool = pool;
}

salaDAO.prototype.insert = function(nome, cb) {
  this._pool().getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query('INSERT INTO TB_SALA(NM_SALA, DT_PARTIDA, ID_STATUS) VALUES(?, NOW(), 1)', [nome], cb, connection.release());
  })
}

salaDAO.prototype.updateJogadoresByIdSala = function(id, jogadores, cb) {
  this._pool().getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query('UPDATE TB_SALA SET QTD_JOGADORES = ? WHERE ID_SALA = ?', [jogadores, id], cb, connection.release());
  })
}

salaDAO.prototype.updateStatusByIdSala = function(id, idstatus, cb) {
  this._pool().getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query('UPDATE TB_SALA SET ID_STATUS = ? WHERE ID_SALA = ?', [idstatus, id], cb, connection.release());
  })
}

salaDAO.prototype.deleteSalaById = function(id, cb) {
  this._pool().getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query('DELETE FROM TB_SALA WHERE ID_SALA = ?', [id], cb, connection.release());
  })
}

salaDAO.prototype.findAll = function(cb) {
  this._pool().getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    var query = "SELECT a.ID_SALA, a.NM_SALA , a.QTD_JOGADORES, b.NM_STATUS ";
    query += "FROM TB_SALA a ";
    query += "INNER JOIN TB_STATUS b ON a.ID_STATUS = b.ID_STATUS"
    connection.query(query, cb, connection.release());
  })
}

salaDAO.prototype.findById = function(id, cb) {
  this._pool().getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.query('SELECT * FROM TB_SALA WHERE ID_SALA = ? AND ID_STATUS = 1', [id], cb, connection.release());
  })
}

module.exports = function() {
  return salaDAO;
}
