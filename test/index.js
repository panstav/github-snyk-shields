const assert = require('power-assert');
const request = require('supertest');

var server, initServer = require('../server');

beforeEach(() => {
	server = initServer();
});

describe('Server', () => {

	describe('/:packageName/:version', () => {

		it('Should result in a shields.io url', done => {

			request(server)
				.get('/express/3.0.0')
				.expect(200)
				.end((err, res) => {
					
					assert(!err);
					assert(typeof(res.text) === 'string');
					assert(res.text.indexOf('http') === 0);
					assert(res.text.indexOf('shields.io') !== -1);

					done();
				});

		});

	});

});