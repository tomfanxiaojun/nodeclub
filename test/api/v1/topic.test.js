var app = require('../../../app');
var request = require('supertest')(app);
var should = require('should');
var support = require('../../support/support');

describe('test/api/v1/topic.test.js', function () {
  
  var mockUser, mockTopic;
  
  before(function (done) {
    support.createUser(function (err, user) {
      mockUser = user;
      support.createTopic(user.id, function (err, topic) {
        mockTopic = topic;
        done();
      });
    });
  });

  describe('get /api/v1/topics', function () {

    it('should return topics', function (done) {
      request.get('/api/v1/topics')
        .end(function (err, res) {
          should.not.exists(err);
          res.body.success.should.true();
          res.body.data.length.should.above(0);
          done();
        });
    });

    it('should return topics with limit 2', function (done) {
      request.get('/api/v1/topics')
        .query({
          limit: 2
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.body.success.should.true();
          res.body.data.length.should.equal(2);
          done();
        });
    });

  });

  describe('get /api/v1/topic/:topicid', function () {

    it('should return topic info', function (done) {
      request.get('/api/v1/topic/' + mockTopic.id)
        .end(function (err, res) {
          should.not.exists(err);
          res.body.success.should.true();
          res.body.data.id.should.equal(mockTopic.id);
          done();
        });
    });

    it('should fail when topic_id is not valid', function (done) {
      request.get('/api/v1/topic/' + mockTopic.id + 'not_valid')
        .end(function (err, res) {
          should.not.exists(err);
          res.status.should.equal(422);
          res.body.success.should.false();
          done();
        });
    });

    it('should fail when topic not found', function (done) {
      var notFoundTopicId = mockTopic.id.split("").reverse().join("");
      request.get('/api/v1/topic/' + notFoundTopicId)
        .end(function (err, res) {
          should.not.exists(err);
          if (mockTopic.id === notFoundTopicId) { // 小概率事件id反转之后还不变
            res.body.success.should.true();
            res.body.data.id.should.equal(mockTopic.id);
          } else {
            res.status.should.equal(404);
            res.body.success.should.false();
          }
          done();
        });
    });

  });

  describe('post /api/v1/topics', function () {

    it('should create a topic', function (done) {
      request.post('/api/v1/topics')
        .send({
          accesstoken: mockUser.accessToken,
          title: '我是API测试标题',
          tab: 'share',
          content: '我是API测试内容'
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.body.success.should.true();
          res.body.topic_id.should.be.String();
          done();
        });
    });

    it('should 401 with no accessToken', function (done) {
      request.post('/api/v1/topics')
        .send({
          title: '我是API测试标题',
          tab: 'share',
          content: '我是API测试内容'
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.status.should.equal(401);
          res.body.success.should.false();
          done();
        });
    });

    it('should fail with no title', function (done) {
      request.post('/api/v1/topics')
        .send({
          accesstoken: mockUser.accessToken,
          title: '',
          tab: 'share',
          content: '我是API测试内容'
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.status.should.equal(422);
          res.body.success.should.false();
          done();
        });
    });

    it('should fail with error tab', function (done) {
      request.post('/api/v1/topics')
        .send({
          accesstoken: mockUser.accessToken,
          title: '我是API测试标题',
          tab: '',
          content: '我是API测试内容'
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.status.should.equal(422);
          res.body.success.should.false();
          done();
        });
    });

    it('should fail with no content', function (done) {
      request.post('/api/v1/topics')
        .send({
          accesstoken: mockUser.accessToken,
          title: '我是API测试标题',
          tab: 'share',
          content: ''
        })
        .end(function (err, res) {
          should.not.exists(err);
          res.status.should.equal(422);
          res.body.success.should.false();
          done();
        });
    });

  });
  
});
