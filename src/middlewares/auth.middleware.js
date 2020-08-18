const auth = async (req, res, next) => {

    try {

        //validate ...
        req.user = { id: 917};
      
    } catch(e) {
        res.status(401).json({error: 'Please authenticate.!'})
    }

    next();
}

module.exports = auth;