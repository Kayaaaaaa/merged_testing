var supertest = require('supertest');

describe('UserController', function () {

    /////////login unit test
    describe('#login() with admin account', function () {
        it('should redirecting to import and export page', function (done) {
            supertest(sails.hooks.http.app)
                .post('/user/login')
                .send({ username: 'kelly', password: 'wecarebill' })
                .expect(302, 'Found. Redirecting to /user/csv', done);
        });
    });


    describe('#login() with non-exists account', function () {
        it('should return status 401 with "User not found" in body', function (done) {
            supertest(sails.hooks.http.app)
                .post('/user/login')
                .send({ username: 'user', password: '123456' })
                .expect(401, 'User not found', done);
        });
    });

    ///////logout unit test
    describe('#logout() function', function () {
        it('should return status 200 with "Log out successfully!" in body', function (done) {
            supertest(sails.hooks.http.app)
                .get('/user/logout')
                .expect(200, '"Log out successfully!"', done);
        });
    });
});