const express = require('express')
const server = express()

let projects = []

let requestCounter = 0

server.use(express.json())

server.use((req, res, next) => {
	requestCounter++
	console.log({ requestCounter })
	next()
})

const idFinder = id => project => project.id == id

const hasProject = (req, res, next) => {
	const { id } = req.params
	return projects.find(idFinder(id)) ? next()
	: res.status(400).json({ error: 'Id not found' })
}

server.get('/projects', (req, res) => {
	return res.json(projects)
})

server.post('/projects', (req, res) => {
	const { id, title } = req.body

	projects.push({ id, title, tasks: [] })
	return res.json(projects)
})

server.put('/projects/:id', hasProject, (req, res) => {
	const { id } = req.params
	const { title } = req.body

	projects.find(idFinder(id)).title = title
	return res.json(projects)
})

server.delete('/projects/:id', hasProject, (req, res) => {
	const { id } = req.params

	projects = projects.filter(project => project.id != id)
	return res.send()
})

server.post('/projects/:id/tasks', hasProject, (req, res) => {
	const { id } = req.params
	const { title } = req.body

	projects.find(idFinder(id)).tasks.push(title)
	return res.json(projects)
})

server.listen(3000)
