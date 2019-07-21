const express = require('express')

const server = express()

server.use(express.json())

const users = ['Diego', 'Robson', 'Victor']

server.use((req, res, next) => {
	console.time('Request')
	console.log(`Método: ${req.method}; URL: ${req.url}`)
	next()
	console.timeEnd('Request') 
})

const checkUserExists = (req, res, next) => {
	return req.body.name ? next()
	: res.status(400).json({ error: 'User name is required' })
}

const checkUserInArray = (req, res, next) => {
	return users[req.params.index] ? next()
	: res.status(400).json({ error: 'User does not exists' })
}

server.get('/users/:index', checkUserInArray, (req, res) => {
	const { index } = req.params
	return res.json(users[index])
})

server.get('/users', (req, res) => {
	return res.json(users)
})

server.post('/users', checkUserExists, (req, res) => {
	const { index } = req.params
	const { name } = req.body

	users.push(name)
	return res.json(users)
})

server.put('/users/:index', checkUserExists, checkUserInArray, (req, res) => {
	const { index } = req.params
	const { name } = req.body

	users[index] = name
	return res.json(users)
})

server.delete('/users/:index', checkUserInArray, (req, res) => {
	const { index } = req.params

	users.splice(index, 1)
	return res.send()
})

server.listen(3000)
