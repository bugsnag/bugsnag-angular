const test = require('tape')
const { promisify } = require('util')
const { version } = require('../package.json')
const { exec, spawn } = require('child_process')
const puppeteer = require('puppeteer')

let ngServeProcess = null

// install testapp's dependencies
async function prepare () {
  console.log(`exec (bugsnag-angular): npm run build`)
  await promisify(exec)(`npm run build`)
  console.log(`exec (bugsnag-angular): npm pack`)
  await promisify(exec)(`npm pack`)
  console.log(`exec (testapp): npm install --no-package-lock`)
  await promisify(exec)(`npm install --no-package-lock`, { cwd: `${__dirname}/testapp` })
  console.log(`exec (testapp): npm install --no-save --no-package-lock bugsnag-js@latest ../../bugsnag-angular-${version}.tgz`)
  await promisify(exec)(`npm install --no-save --no-package-lock bugsnag-js@latest ../../bugsnag-angular-${version}.tgz`, { cwd: `${__dirname}/testapp` })
}

// run ng serve
function runServer () {
  console.log(`spawn (testapp): ng serve --prod`)
  const proc = spawn(`ng`, [ `serve`, `--prod` ], { cwd: `${__dirname}/testapp` })
  proc.stdout.on('data', data => {
    if (/webpack: Compiled successfully\./.test(data)) proc.emit('ng:ready')
  })
  proc.stderr.on('data', data => console.log('' + data))
  return proc
}

// kick it all off
// waits for the ng server to be ready before running the tests
async function go () {
  try {
    await prepare()
    console.log('ng serve (testapp): start')
    ngServeProcess = runServer()
      .on('ng:ready', () => {
        console.log('ng serve (testapp): ready')
        addTests()
      })
  } catch (e) {
    throw e
  }
}

// kills long running ng serve process (if running)
function killServer () {
  if (ngServeProcess) ngServeProcess.kill()
  ngServeProcess = null
}

// add test harness
function addTests () {
  console.log('test harness: adding tests')

  test('ng serve in --prod/--aot mode should run without issues', t => {
    t.plan(2)

    let msgs = 0
    const expected = { type: 'debug', text: '[bugsnag] Loaded!' }

    puppeteer.launch()
      .then(async browser => {
        const page = await browser.newPage()

        const end = async err => {
          console.log('test: end', err ? '(with err)' : '(without err)')
          await page.close()
          await browser.close()
          browser.disconnect()
          console.log('test: browser closed')
          killServer()
          console.log('test: server stopped')
          t.end(err)
        }

        page.on('console', async msg => {
          try {
            if (msgs > 0) return await end(new Error('multiple logs received'))
            t.equal(msg.type(), expected.type)
            t.equal(msg.text(), expected.text)
            setTimeout(async () => {
              await end()
            }, 5000)
          } catch (err) {
            await end(err)
          }
        })

        await page.goto('http://localhost:4200')
      })
      .catch(err => {
        killServer()
        t.end(err)
      })
  })
}

go()
