import jvt from "jsonwebtoken"

const { verify } = jvt

const auth = (req, res, next) => {
    const token = req.headers['authorization']
    if(!token) {
        return res.status(401).json({error: 'No token provided'})
    }
    verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.status(401).json({message: 'failed to authenticate token'})
        }
        next()
    })
}
export { auth }