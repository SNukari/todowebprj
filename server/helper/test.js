import fs from "fs"
import path from "path"
import { pool } from "./db.js"
import jvt from "jsonwebtoken"
import { hash } from "bcrypt"

const __dirname = import.meta.dirname


export async function initializeTestDb() {
  const sql = fs.readFileSync(path.resolve(__dirname, "../todo.sql"), "utf-8")
  await pool.query(sql)
  console.log("Test database initialized")
}


export async function insertTestUser(user) {
  const hashedPassword = await hash(user.password, 10)
  await pool.query(
    "INSERT INTO account (email, password) VALUES ($1, $2)",
    [user.email, hashedPassword]
  )
  console.log("Test user inserted successfully")
}


export function getToken(email) {
  return jvt.sign({ email }, process.env.JWT_SECRET_KEY)
}
