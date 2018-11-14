function SeasonDAO(pool){
	this._pool = pool;
}

SeasonDAO.prototype.gerarRankingProcedure = function (nm_season,cb) {
	this._pool().getConnection(function (err,connection) {
		if (err) {
			throw err
		}
		var options = {sql: 'call gerar_ranking(?)', nestTables: true};
		connection.query(options,[nm_season],cb,connection.release())
	})
};

SeasonDAO.prototype.findBySeason = function(nm_season, cb) {
	this._pool().getConnection(function (err,connection) {
		if (err) {
			throw err;
		}
		connection.query('SELECT NM_SEASON FROM TB_SEASON WHERE NM_SEASON = ?',[nm_season],cb,connection.release())
	})
};

SeasonDAO.prototype.insert = function (nm_season, cb) {
  this._pool().getConnection((err,connection)=>{
    if (err) {
      throw err;
    }
    connection.query("INSERT INTO TB_SEASON(NM_SEASON) VALUES($1) returning ID_SEASON",[nm_season], cb,connection.release());
  })
};

SeasonDAO.prototype.findAll = function (cb) {
	this._pool().getConnection((err,connection)=>{
		if (err) {
			throw err;
		}
		var query = "SELECT nm_season,date_part('month',dt_inicio) +'/'+ date_part('day',dt_inicio) + '/' + date_part('year',dt_inicio) as 'dataInicio " ;
		query += 'FROM TB_SEASON'
		connection.query('SELECT * FROM TB_SEASON ORDER BY DT_INICIO DESC',cb,connection.release());
	})
};

SeasonDAO.prototype.updateDtFim = function(cb){
	this._pool().connect((err,connection)=>{
		if (err) {
			throw err;
		}
		var query = 'UPDATE TB_SEASON ';
		query += 'SET DT_FIM = CURRENT_TIMESTAMP ';
		query += 'WHERE DT_FIM IS NULL ';
		connection.query(query,cb,connection.release());
	})
}

module.exports = function(){
	return SeasonDAO;
}
