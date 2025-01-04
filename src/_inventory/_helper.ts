export const getMyName = () => {

    const e = new Error('dummy')
    const stack = e.stack!
        .split('\n')[2]
        // " at functionName ( ..." => "functionName"
        .replace(/^\s+at\s+(.+?)\s.+/g, '$1')
    return stack
}