const express = require('express');

const getDeps = require('@panstav/dependency-tree');
const isOnSnyk = require('@panstav/is-on-snyk-vulndb');

module.exports = initServer;

function initServer(){

	const server = express();

	server.get('/:packageName/:version', (req, res) => {

		const packageObj = { name: req.params.packageName, version: req.params.version };

		getDeps(packageObj)
			.then(collectFlatTreeAndTopPackage)
			.then(checkEachOnSnyk)
			.then(transformToShieldUrl)
			.then(result => res.send(result))
			.catch(err => {
				console.error(err);
				console.error(err.stack);
				res.send(500).end();
			});

		function collectFlatTreeAndTopPackage(result){
			result.flatTree.push(packageObj);
			return result.flatTree;
		}

		function checkEachOnSnyk(deps){

			const promiseToSnyk = deps.map(dep => isOnSnyk(dep.name, dep.version));

			return Promise.all(promiseToSnyk)
				.then(arr => arr.filter(item => item !== false));

		}

		function transformToShieldUrl(result){
			if (!result.length) return 'https://img.shields.io/badge/Snyk-Safe-blue.svg';

			const numberedVulnCount = `${result.length}_known_${result.length === 1 ? 'vulnerability' : 'vulnerabilities'}`;

			return `https://img.shields.io/badge/Snyk-${numberedVulnCount}-red.svg`
		}

	});

	return server;
}