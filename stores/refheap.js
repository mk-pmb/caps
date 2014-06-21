var request = require('superagent');

module.exports = {
  maxChunkSize: 460797, // 614396 bytes of base64-encoded data

  URL: 'https://www.refheap.com/api',

  put: function(buf, done) {
    request.post(this.URL + '/paste')
      .type('form')
      .send({ private: true })
      .send({ contents: buf.toString('base64') })
      .on('error', done)
      .end(function(res) {
        if (res.body['paste-id'])
          done(null, res.body['paste-id']);
        else
          done(new Error('no paste id'));
      });
  },

  get: function(id, done) {
    request.get(this.URL + '/paste/' + id)
      .on('error', done)
      .end(function(res) {
        if (res.body.contents)
          done(null, new Buffer(res.body.contents, 'base64'));
        else
          done(new Error('no paste contents'));
      });
  }
};