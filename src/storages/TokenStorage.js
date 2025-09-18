'use strict'
const db = require('../db')
const token = db('tokens')

module.exports = {
   async setToken(username, role, refreshToken) {
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 14)
      const sql = `
    INSERT INTO tokens (username, role, token, expires_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *;`
      const values = [username, role, refreshToken, expiresAt]
      return (await token.query(sql, values)).rows
   },
   
   async getToken(username) {
      const sql = `
         SELECT token 
         FROM tokens 
         WHERE username = $1 AND expires_at > NOW();
      `
      const values = [username]
      const result = await token.query(sql, values)
      return result.rows.length > 0 ? result.rows[0].token : null
   },
   async getByUsernameToken(username, refreshToken) {
      const sql = `
         SELECT token 
         FROM tokens 
         WHERE username = $1 AND expires_at > NOW() AND token = $2;
      `
      const values = [username, refreshToken]
      const result = await token.query(sql, values)
      return result.rows.length > 0 ? result.rows[0].token : null
   },
   async deleteToken(username) {
      const sql = 'DELETE FROM tokens WHERE username = $1'
      const values = [username]
      return await token.query(sql, values)
   }
}