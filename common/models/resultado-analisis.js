'use strict';

module.exports = function(Resultadoanalisis) {
  const superagent = require('superagent');
  Resultadoanalisis.peticionAnalisis = function(idPrincipal, documento, cb) {
      //console.log(cb);
    let date = documento.document.date;
    delete documento.document.date;
    superagent
      .post('https://language.googleapis.com/v1/documents:analyzeSentiment?key=AIzaSyBdXTsP99oTtcHGOVuFTRRsGQYMB262sa4')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(documento))
       .end((err, res) => {
          if (err) {  console.log('errrr ===============================', err);
                return cb(err);
              } else {
                documento.document.date = date;
                documento.document.idPrincipal = idPrincipal;
                documento.document.sentiment = res.body.sentences[0].sentiment;
                Resultadoanalisis.create(documento, function(err, resultado) {
                    if(err) {
                        return cb(err);
                    } else {
                        console.log('documento: ', documento);
                        return cb(null, res.body.sentences);
                    }
                });   
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
