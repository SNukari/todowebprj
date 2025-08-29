import { pool } from "../helper/db"
import { Router } from "express"

const router = Router()



router.get('/', (req, res) => {
    
    //res.status(200).json({result: "Success"})
    pool.query('SELECT * FROM task', (error, results) => {
        if(error) {
            return next (error)
        }
        res.status(200).json(results.rows)
})
})
router.post('/create', (req, res) => {
    
    const { task } = req.body

    if(!task) {
        return res.status(400).json({error: 'Task is required'})
    }

    pool.query('INSERT INTO task (description) VALUES ($1) returning', [task.description],
         (error, result) => {
        if(error) {
            return next (error)
        }
        res.status(201).json({id: result.rows[0].id, description: task.description})
})
})

router.delete('/delete/:id', (req, res) => {
    
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
})
export default router