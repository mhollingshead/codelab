const router = require('express').Router();
const { LuaFactory } = require('wasmoon');

let logs = [];
console.log = async function() {
    for (let i = 0; i < arguments.length; i++) logs.push({"data": await arguments[i], "type": "log"})
};

router.post('/',  async (req, res)  => {
    const factory = new LuaFactory();
    const lua = await factory.createEngine();
    logs = [];

    try {
        await lua.doString(req.body.data);
    } catch(e) {
        logs.push({"data": e.message, "type": "error"});
    } finally {
        lua.global.close();
        res.status(200).json(logs);
    }
})

module.exports = router;