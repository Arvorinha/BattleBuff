const BattleriteAPI = require('battlerite-api');

var api = function(){
  return new BattleriteAPI({
    apiKey: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5OTFiZGQwMC04MzE4LTAxMzYtY2Q5ZC0wYTU4NjQ2MDA2MjgiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTM0Mzc5MDQxLCJwdWIiOiJzdHVubG9jay1zdHVkaW9zIiwidGl0bGUiOiJiYXR0bGVyaXRlIiwiYXBwIjoidGVzdC02YjVkOTg3ZS05YTRmLTQxYTMtOTZhYy01NzVlMmJmMTBiYWMiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0IjoxMH0.YuEfTLYI64cGq__6qnSSqtXSmKCR_CYGQZnKzKfXdmA',
    baseURL: 'https://api.developer.battlerite.com',
  });
}

module.exports = function(){
  return api;
}
