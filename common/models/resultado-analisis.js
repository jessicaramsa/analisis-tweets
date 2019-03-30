'use strict';

module.exports = function(Resultadoanalisis) {
  const superagent = require('superagent');
  Resultadoanalisis.peticionAnalisis = function(idPrincipal, documento, cb) {
      //console.log(cb);
    
    
    Resultadoanalisis.create(documento, function(err, resultado) {
        if(err) {
            return cb(err);
        } else {
            delete documento.document.date;
            console.log('documento: ', documento);
            superagent
            .post('https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyBdXTsP99oTtcHGOVuFTRRsGQYMB262sa4')
            .set('Content-Type', 'application/json')
            .send(JSON.stringify(documento))
            .end((err, res) => {
              if (err) {  console.log('errrr ===============================', err);
                return cb(err);
              }
              //console.log(res.body.sentences);
              return cb(null, res.body.sentences);
            })
        }
    });
    
  };

  Resultadoanalisis.remoteMethod('peticionAnalisis', {
    http: {verb: 'post', path: '/peticion-analisis'},
    accepts:[
        {arg: 'idPrincipal', type: 'string', http: {source: 'query'}, required: true},
        {arg: 'documento', type: 'object', http: {source: 'body'}, required: true},
    ],
    returns: {arg: 'resultados', type: 'object'}
  })
};
