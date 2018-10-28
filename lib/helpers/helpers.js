const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
    pipe,
    wait
}