import { pool } from "../helper/db.js"
import { Router } from "express"
import { auth } from "../helper/auth.js"
import { deleteTask, getTasks, postTask } from "../controllers/TaskController.js"
//import { insertTask } from "../models/Task.js"

const todoRouter = Router()

todoRouter.get('/', getTasks)
/*
todoRouter.get('/', (req, res) => {
    
    //res.status(200).json({result: "Success"})
    pool.query('SELECT * FROM task', (error, results) => {
        if(error) {
            return next (error)
        }
        res.status(200).json(results.rows)
})
})*/

todoRouter.post('/create', auth, postTask)

/*
todoRouter.post('/create', auth, (req, res,next) => {
    
    const { task } = req.body

    if(!task) {
        return res.status(400).json({error: 'Task is required'})
    }

    pool.query('INSERT INTO task (description) VALUES ($1) returning *', [task.description],
         (error, result) => {
        if(error) {
            return next (error)
        }
        res.status(201).json({id: result.rows[0].id, description: task.description})
})
})*/

todoRouter.delete('/delete/:id', auth, deleteTask)

/*
todoRouter.delete('/delete/:id', (req, res,next) => {
    
    const { id } = req.params

    console.log('Deleting task with id:', id)
    pool.query('DELETE FROM task WHERE id = $1',
        [id], (error, result) => {
            if(error) {
                console.error(error.message)
                return next (error)
            }
            if(result.rowCount === 0) {
                const errori = new Error('Task not found')
                errori.status = 404
                return next (errori)
            }
            return res.status(200).json({id:id})
        }
    )
}) */
export default todoRouter;