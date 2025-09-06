import { pool } from "../helper/db.js";
import { Router } from "express";
import { hash, compare } from "bcrypt";
import jvt from "jsonwebtoken"; //, { JsonWebTokenError }
import { use } from "react";

export async function insertTestUser(user) {
  const hashedPassword = await hash(user.password, 10);
  await pool.query('INSERT INTO account (email, password) VALUES ($1, $2)',
    [user.email, hashedPassword])}

const { sign } = jvt;

const userRouter = Router();

userRouter.post('/signup', (req, res, next) => {
    const { user } = req.body;

    if(!user || !user.email || !user.password) {
        const error = new Error('Email and password are required')
        error.status = 400
        return next(error)
    }
    pool.query('SELECT * FROM account WHERE email = $1', [user.email], (err, result) => {
        if (err) return next(err)
        if (result.rows.length > 0) {
            const error = new Error('Email already in use')
            error.status = 409
            return next(error)
        }
   


    hash(user.password, 10, (err, hashedPassword) => {
        if(err) return next(err)

        pool.query('INSERT INTO account (email, password) VALUES ($1, $2) RETURNING *',
            [user.email, hashedPassword],
            (err, result) => {
                if(err) {
                    return next(err)
                }
                const dbUser = result.rows[0]
                res.status(201).json({id: dbUser.id, email: dbUser.email})
            })
        })
 })
})

userRouter.post('/signin', (req, res, next) => {
  const { user } = req.body
  if (!user || !user.email || !user.password) {
    const error = new Error("Email and password are required")
    error.status = 400
    return next(error)
  }

  pool.query("SELECT * FROM account WHERE email = $1", [user.email], (err, result) => {
    if (err) return next(err)
    if (result.rows.length === 0) {
      const error = new Error("User not found")
      error.status = 404
      return next(error)
    }

    const dbUser = result.rows[0]
    compare(user.password, dbUser.password, (err, isMatch) => {
      if (err) return next(err)
      if (!isMatch) {
        const error = new Error("Invalid password")
        error.status = 401
        return next(error)
      }

      const token = sign({ user: dbUser.email }, process.env.JWT_SECRET_KEY)
      res.status(200).json({
        id: dbUser.id,
        email: dbUser.email,
        token
      })
    })
  })
})



export default userRouter