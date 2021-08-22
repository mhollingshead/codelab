const router = require('express').Router();
const { exec } = require('child_process');

router.get('/:lang', (req, res) => {
    const lang = req.params.lang === "c_cpp" ? "cpp" : req.params.lang;
    const versionCmd = (lang === 'lua') ? '-v' : '--version';
    exec(`${lang} ${versionCmd}`, (error, stdout, stderror) => {
        if (error || stderror) {
            console.log(error, stderror);
            res.status(400).send("Could not find version information");
        } else {
            res.status(200).send(stdout);
        }
    });
})

module.exports = router;