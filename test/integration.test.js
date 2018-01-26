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
  console.log(`exec (testapp): npm install`)
  await promisify(exec)(`npm install`, { cwd: `${__dirname}/testapp` })
  console.log(`exec (testapp): npm install ../../bugsnag-angular-${version}.tgz`)
  await promisify(exec)(`npm install ../../bugsnag-angular-${version}.tgz`, { cwd: `${__dirname}/testapp` })
}

function runServer () {
  console.log(`spawn (testapp): npm start -- --prod`)
  const proc = spawn(`npm`, [ `start`, `--`, `--prod` ], { cwd: `${__dirname}/testapp` })
  proc.stdout.on('data', data => {
    if (/webpack: Compiled successfully\./.test(data)) proc.emit('ng:ready')
  })
  proc.stderr.on('data', data => console.log('' + data))
  return proc
}

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

function killServer () {
  if (ngServeProcess) ngServeProcess.kill()
  ngServeProcess = null
}

function addTests () {
  console.log('test harness: adding tests')

  test('ng serve in --prod/--aot mode should run without issues', t => {
    t.plan(2)

    let msgs = 0
    const expected = { type: 'debug', text: '[bugsnag] Loaded!' }

    puppeteer.launch()
      .then(async browser => {
        const end = async err => {
          console.log('test: end', err ? '(with err)' : '(without err)')
          await browser.close()
          console.log('test: browser closed')
          killServer()
          console.log('test: server stopped')
          t.end(err)
        }

        const page = await browser.newPage()

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
