const { promisify } = require('util')
const { version } = require('./package.json')
const { exec, spawn } = require('child_process')

// run ng serve
function runServer () {
  console.log(`spawn (testapp): npm start -- --prod`)
  const proc = spawn(`npm`, [ `start`, `--`, `--prod` ], { cwd: `${__dirname}/test/testapp` })
  proc.stdout.on('data', data => {
    console.log(data + '')
    if (/webpack: Compiled successfully\./.test(data)) proc.emit('ng:ready')
  })
  proc.stderr.on('data', data => console.log('' + data))
  return proc
}

// install testapp's dependencies
async function prepare () {
  console.log(`exec (bugsnag-angular): npm run build`)
  await promisify(exec)(`npm run build`)
  console.log(`exec (bugsnag-angular): npm pack`)
  await promisify(exec)(`npm pack`)
  console.log(`exec (testapp): npm install`)
  await promisify(exec)(`npm install`, { cwd: `${__dirname}/test/testapp` })
  console.log(`exec (testapp): npm install ../../bugsnag-angular-${version}.tgz`)
  await promisify(exec)(`npm install ../../bugsnag-angular-${version}.tgz`, { cwd: `${__dirname}/test/testapp` })
}

// kick it all off
// waits for the ng server to be ready before running the tests
async function go () {
  try {
    await prepare()
    console.log('ng serve (testapp): start')
    const ngServeProcess = runServer()
      .on('ng:ready', async () => {
        console.log('ng serve (testapp): ready')
        process.kill(`-${ngServeProcess.pid}`)
      })
  } catch (e) {
    throw e
  }
}

try {
  go()
} catch (e) {
  console.log(e)
}
