function partidaUtils(){}

partidaUtils.sortJSON = function (data, key) {
  return data.sort(function(a, b) {
    var x = a[key];
    var y = b[key];
    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
  });
}

module.exports = function(){
  return partidaUtils;
}
