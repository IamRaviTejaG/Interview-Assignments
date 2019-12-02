/* eslint-disable no-unused-expressions */

/* eslint-disable */
import { server } from '../index'
/* eslint-enable */

import { auth } from '../config/auth'
let rp = require('request-promise')
let chai = require('chai')
let expect = chai.expect
require('dotenv').config()

const testUrl = `http://${process.env.HOST}:${process.env.PORT}`

describe('TESTING MODULES', () => {
  describe('1. Authentication module', () => {
    it('1.1 Checks authentication module', done => {
      let testPayload = {
        username: 'tester',
        password: 'test'
      }
      let token = auth.generateToken(testPayload)
      auth.authorize(token).then(data => {
        expect(data.username).to.equal(testPayload.username)
        done()
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('2. Signup & login routes', () => {
    it('2.1 /signup (with no username)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/signup',
        body: {
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        expect(response.statusCode).to.equal(200)
        expect(response.body.message).to.equal('Bad request!')
        done()
      }).catch(err => {
        done(err)
      })
    })
    it('2.2 /signup (with empty/space-only username)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/signup',
        body: {
          username: '       ',
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        expect(response.statusCode).to.equal(200)
        expect(response.body.message).to.equal('Username should be atleast 3 characters long!')
        done()
      }).catch(err => {
        done(err)
      })
    })
    it('2.3 /login (with no username)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/login',
        body: {
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        expect(response.statusCode).to.equal(200)
        expect(response.body.message).to.equal('Bad request!')
        done()
      }).catch(err => {
        done(err)
      })
    })
    it('2.4 /login (with empty/space-only username)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/login',
        body: {
          username: '       ',
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        expect(response.statusCode).to.equal(200)
        expect(response.body.message).to.equal('Username should be atleast 3 characters long!')
        done()
      }).catch(err => {
        done(err)
      })
    })
    it('2.5 /signup & /login (valid parameters, username already taken & incorrect credentials)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/signup',
        body: {
          username: 'tester' + (Math.floor(new Date() / 1000)).toString(),
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        expect(response.statusCode).to.equal(200)
        expect(response.body.message).to.equal('Signup successful!')

        rp(options).then(response => {
          expect(response.statusCode).to.equal(200)
          expect(response.body.message).to.equal('Username already taken!')
        })

        let options2 = {
          method: 'POST',
          url: testUrl + '/login',
          body: options.body,
          json: true,
          resolveWithFullResponse: true
        }
        rp(options2).then(response => {
          expect(response.statusCode).to.equal(200)
          expect(response.body.message).to.equal('Login successful!')
        })

        let options3 = {
          method: 'POST',
          url: testUrl + '/login',
          body: {
            username: options.body.username,
            password: 'password'
          },
          json: true,
          resolveWithFullResponse: true
        }
        rp(options3).then(response => {
          expect(response.statusCode).to.equal(200)
          expect(response.body.message).to.equal('Incorrect credentials!')
        })

        done()
      }).catch(err => {
        done(err)
      })
    })
    it('2.6 /login (with unregistered username)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/login',
        body: {
          username: 'tester1234',
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        expect(response.statusCode).to.equal(200)
        expect(response.body.message).to.equal('Username doesn\'t exist in the database!')
        done()
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('3. jsonpatch route', () => {
    it('3.1 /jsonpatch (with all valid parameters)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/signup',
        body: {
          username: 'patchtest1' + (Math.floor(new Date() / 1000)).toString(),
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        let options2 = {
          method: 'PATCH',
          url: testUrl + '/jsonpatch',
          headers: {
            'x-jwt-token': response.body.token
          },
          body: {
            'obj': {
              'baz': 'qux',
              'foo': 'bar'
            },
            'patch':
                [
                  { 'op': 'replace', 'path': '/bazs', 'value': 'boo' },
                  { 'op': 'replace', 'path': '/foo', 'value': 'nope' }
                ]
          },
          json: true,
          resolveWithFullResponse: true
        }
        rp(options2).then(response => {
          expect(response.statusCode).to.equal(200)
          expect(response.body).to.be.an('object')
          done()
        })
      }).catch(err => {
        done(err)
      })
    })
    it('3.2 /jsonpatch (without JWT token)', done => {
      let options = {
        method: 'PATCH',
        url: testUrl + '/jsonpatch',
        body: {
          'obj': {
            'baz': 'qux',
            'foo': 'bar'
          },
          'patch':
           [
             { 'op': 'replace', 'path': '/bazs', 'value': 'boo' },
             { 'op': 'replace', 'path': '/foo', 'value': 'nope' }
           ]
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        expect(response.statusCode).to.equal(200)
        expect(response.body.error).to.be.equal('JWT token missing!')
        done()
      }).catch(err => {
        done(err)
      })
    })
    it('3.3 /jsonpatch (with invalid JWT token)', done => {
      let options = {
        method: 'PATCH',
        url: testUrl + '/jsonpatch',
        headers: {
          'x-jwt-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoaXRoZWFkMTIiLCJpYXQiOjE1NTAxNjgxMDUsImV4cCI6MTU1MDI1NDUwNX0.rAW07HL_HiNfCpM2uuaEjomWvjhOyi6Js4Au8J4xXnN'
        },
        body: {
          'obj': {
            'baz': 'qux',
            'foo': 'bar'
          },
          'patch':
           [
             { 'op': 'replace', 'path': '/bazs', 'value': 'boo' },
             { 'op': 'replace', 'path': '/foo', 'value': 'nope' }
           ]
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        expect(response.statusCode).to.equal(200)
        expect(response.body.message).to.be.equal('Bad request!')
        done()
      }).catch(err => {
        done(err)
      })
    })
    it('3.4 /jsonpatch (with invalid body/patch objects)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/signup',
        body: {
          username: 'patchtest4' + (Math.floor(new Date() / 1000)).toString(),
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        let options2 = {
          method: 'PATCH',
          url: testUrl + '/jsonpatch',
          headers: {
            'x-jwt-token': response.body.token
          },
          body: {
            'oj': {
              'baz': 'qux',
              'foo': 'bar'
            },
            'pach':
                [
                  { 'op': 'replace', 'path': '/bazs', 'value': 'boo' },
                  { 'op': 'replace', 'path': '/foo', 'value': 'nope' }
                ]
          },
          json: true,
          resolveWithFullResponse: true
        }
        rp(options2).then(response => {
          expect(response.statusCode).to.equal(200)
          expect(response.body.message).to.equal('Invalid body/patch object!')
          done()
        })
      }).catch(err => {
        done(err)
      })
    })
  })

  describe('4. thumbnail route', () => {
    it('4.1 /thumbnail (with valid URL)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/signup',
        body: {
          username: 'thumbtest1' + (Math.floor(new Date() / 1000)).toString(),
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        let options2 = {
          method: 'POST',
          url: testUrl + '/thumbnail',
          headers: {
            'x-jwt-token': response.body.token
          },
          body: {
            url: 'https://images.genius.com/45ec0de51bb40875bb88a93f7961a282.960x960x1.jpg'
          },
          json: true,
          resolveWithFullResponse: true
        }
        rp(options2).then(response => {
          expect(response.statusCode).to.equal(200)
          expect(response.body.message).to.equal('Thumbnail saved!')
          done()
        })
      }).catch(err => {
        done(err)
      })
    })
    it('4.2 /thumbnail (with invalid URL)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/signup',
        body: {
          username: 'thumbtest2' + (Math.floor(new Date() / 1000)).toString(),
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        let options2 = {
          method: 'POST',
          url: testUrl + '/thumbnail',
          headers: {
            'x-jwt-token': response.body.token
          },
          body: {
            url: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp'
          },
          json: true,
          resolveWithFullResponse: true
        }
        rp(options2).then(response => {
          expect(response.statusCode).to.equal(200)
          expect(response.body.message).to.equal('Invalid URL!')
          done()
        })
      }).catch(err => {
        done(err)
      })
    })
    it('4.3 /thumbnail (without URL)', done => {
      let options = {
        method: 'POST',
        url: testUrl + '/signup',
        body: {
          username: 'thumbtest3' + (Math.floor(new Date() / 1000)).toString(),
          password: 'test'
        },
        json: true,
        resolveWithFullResponse: true
      }
      rp(options).then(response => {
        let options2 = {
          method: 'POST',
          url: testUrl + '/thumbnail',
          headers: {
            'x-jwt-token': response.body.token
          },
          json: true,
          resolveWithFullResponse: true
        }
        rp(options2).then(response => {
          expect(response.statusCode).to.equal(200)
          expect(response.body.message).to.equal('URL field unavailable!')
          done()
        })
      }).catch(err => {
        done(err)
      })
    })
  })
})
