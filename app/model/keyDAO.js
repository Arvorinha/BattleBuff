function keyDAO(pool){
  this._pool = pool;
}

keyDAO.prototype.findByKey = function (key,callback) {
  this._pool().connect((err,client,done) => {
    if (err) throw (err);
    client.query('SELECT KEY FROM TB_KEY WHERE KEY=$1',[key],callback);
  });
}

keyDAO.prototype.insert = function (key,callback) {
  this._pool().connect((err,client,done) => {
    client.query('INSERT INTO TB_KEY(KEY) VALUES($1)',[key],callback);
  })
};

keyDAO.prototype.findAll = function (callback) {
  this._pool().connect((err,client,done)=>{
    client.query('SELECT * FROM TB_KEY',callback);
  })
};

module.exports = function(){
  return keyDAO;
}
