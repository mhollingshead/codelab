const router = require('express').Router();
const micropython = require('micropython');

let logs = [];

router.post('/',  async (req, res)  => {
    micropython.init(64 * 1024);
    logs = [];

    try {
        logs.push({"data": await micropython.do_str(req.body.data), "type": "log"});
    } catch(e) {
        logs.push({"data": e.message, "type": "error"});
    } finally {
        res.status(200).json(logs);
    }
})

module.exports = router;