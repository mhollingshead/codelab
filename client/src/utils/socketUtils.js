import { evaluate, logError, logInput } from "./consoleUtils";

export const handleOutput = output => {
    if (output.vanillaJS) {
        evaluate(output.data);
    } else {
        if (output.error) {
            logError(output.data)
        } else {
            output.data.split('\n').forEach((log, ind, arr) => {
                if (log === '') {
                    if (arr[ind+1]) console.log(log)
                } else {
                    console.log(log)
                }
            })
        }
    }
}

export const handleInput = input => {
    logInput(input.data);
}