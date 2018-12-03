function RankDAO(pool){
	this._pool = pool;
}

RankDAO.prototype.findRankByPageAndSeason = function(id_season,min,cb){
	this._pool().getConnection(function (err,connection) {
		if (err) {
			throw err
		}
		connection.query('SELECT * FROM TB_RANK WHERE ID_SEASON = ? ORDER BY MMR_RANKING DESC LIMIT ?,7',[id_season,min],cb,connection.release());
	})
}

RankDAO.prototype.findAllRankBySeason = function(id_season,cb){
	this._pool().getConnection(function (err,connection) {
		if (err) {
			throw err
		}
		connection.query('SELECT * FROM TB_RANK WHERE ID_SEASON =?',[id_season],cb,connection.release());
	})
}

module.exports = function(){
	return RankDAO;
}
