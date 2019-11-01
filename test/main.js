const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const should = chai.should()

chai.use(chaiHttp)

describe('All API tests', () => {

  describe('GET /', () => {
      it('should return Hello World!', (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                  res.should.have.status(200)
                  res.text.should.be.a('string')
                  res.text.should.equal('Hello World!')
              done()
            })
      })
  })

  describe('POST /', () => {
      it('Should return data that was sent.', (done) => {
        chai.request(server)
            .post('/?content=test123')
            .send({})
            .end((err, res) => {
                  res.should.have.status(200)
                  res.text.should.be.a('string')
                  res.text.should.equal('test123')
              done()
            })
      })
  })

})