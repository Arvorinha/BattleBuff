function RankDAO(pool){
	this._pool = pool;
}

RankDAO.prototype.findRankByPageAndSeason = function(id_season,min,cb){
	this._pool().getConnection(function (err,connection) {
		if (err) {
			throw err
		}
		connection.query('SELECT * FROM TB_RANK WHERE ID_SEASON =? LIMIT ?,7',[id_season,min],cb,connection.release());
	})
}

RankDAO.prototype.findAllRankBySeason = function(min,cb){
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
