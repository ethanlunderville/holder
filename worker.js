require('dotenv').config();
const { Builder , By, Key, until, WebDriverWait, on, WebDriver, Capabilities, Session } = require("selenium-webdriver");
const { Command, Name } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/lib/command');
const { Driver, ServiceBuilder, createExecutor } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/firefox');

const { executeCommand, filterNonW3CCaps } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/lib/webdriver');
const { Executor } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/lib/http');
const { DriverService } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/remote/index');
//const { executeCommand, filterNonW3CCaps } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/remote/index');


WebDriver.createSession = function (executor, capabilities, onQuit = undefined) {

    let cmd = new Command(Name.NEW_SESSION)

    cmd.setParameter('capabilities', {
      firstMatch: [{}],
      alwaysMatch: filterNonW3CCaps(capabilities),
    })
    
    //let session = executeCommand(executor, cmd)

    let innerMap = new Map();
    innerMap.set('acceptInsecureCerts' , false);
    innerMap.set('browserName' , 'firefox');
    innerMap.set('browserVersion' , '103.0');
    innerMap.set('moz:accessibilityChecks' , false);
    innerMap.set('moz:buildID' , '20220718155818');
    innerMap.set('moz:geckodriverVersion' , '0.32.2');
    innerMap.set('moz:headless' , false);
    innerMap.set('moz:platformVersion' , '5.15.0-41-generic');
    innerMap.set('moz:processID' , 63636);
    innerMap.set('moz:profile' , '/tmp/rust_mozprofileBcX5pG');
    innerMap.set('moz:shutdownTimeout' , 60000);
    innerMap.set('moz:useNonSpecCompliantPointerOrigin' , false);
    innerMap.set('moz:webdriverClick' , true);
    innerMap.set('moz:windowless' , false);
    innerMap.set('pageLoadStrategy' , 'normal');
    innerMap.set('platformName' , 'linux');
    innerMap.set('proxy' , {});
    innerMap.set('setWindowRect' , true);
    innerMap.set('strictFileInteractability' , false);
    innerMap.set('timeouts' , { implicit: 0, pageLoad: 300000, script: 30000 });
    innerMap.set('unhandledPromptBehavior' , 'dismiss and notify')

    let session = new Promise((resolve, reject)=>{

        let s = new Session() 
        s.id_ = '34f54bb6-b62a-4665-8efe-345f92783fbf'
        s.caps_ = new Capabilities;
        s.caps_.map_ = innerMap;

        resolve(s);

    })
    
    session.then((e)=>{console.log(e)})
    
   

    if (typeof onQuit === 'function') {
      session = session.catch((err) => {
        return Promise.resolve(onQuit.call(void 0)).then((_) => {
          throw err
        })
      })
    }
    return new WebDriver(session, executor, onQuit)
  
}


Driver.createSession = function (opt_config, opt_executor) {
    let caps =
      opt_config instanceof Capabilities ? opt_config : new Options(opt_config)

    let executor
    let onQuit

    if (opt_executor instanceof Executor) { 
      executor = opt_executor
      configureExecutor(executor)
    } else if (opt_executor instanceof DriverService) {
      executor = createExecutor(opt_executor.start())
      onQuit = () => opt_executor.kill()
    } else {
      //THIS RUNS
      /*
      let service = new ServiceBuilder().build()
      let updatedService = service.start(); // UPDATED SERVICE IS THE IP AND PORT
      executor = createExecutor(updatedService)
      */
      let updatedService = new Promise((resolve)=>{
        resolve("http://127.0.0.1:46185/");
      })
      updatedService.then((e)=>{
        console.log(e)}
      )
    
      executor = createExecutor(updatedService)
      onQuit = () => service.kill()
    }

    return /** @type {!Driver} */ (WebDriver.createSession(executor, caps, onQuit))
  }


const driver = new Builder().forBrowser("firefox").build();
const fs = require('fs');
const promise = require('selenium-webdriver/lib/promise');

function system(command) {
    execSync(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    })
};

async function readCookies(driverRef) {
    //console.log(driver);
    let cookies;
    await fs.readFile('./cookies.txt', 'utf8', (err, data) => {

        if (err) throw err;

        cookies = data.split("\n");
        //console.log(cookies);

        if (cookies != undefined) {
            cookies.forEach((cookie)=>{

                //console.log(driver);
                if (cookie.includes('{') && cookie.includes('}')) {
                    let newCookie = JSON.parse(cookie);
                    newCookie.secure=true;
                    //console.log(newCookie);
                    driverRef.manage().addCookie(newCookie);
                }
            })
        }

    });

}

async function writeCookies(driver) {

    system('echo "" > cookies.txt');

    let cookies = await driver.manage().getCookies();

    cookies = cookies.map( (cookie) =>{

        return JSON.stringify(cookie);
   
    }).reduce((acc, str) => {

        return acc + str + "\n";

    }, "");

}

function writeObjectToJsonFile(obj) {
  system('echo "" > ./mountinfo.json');
  const json = JSON.stringify(obj, null, 2); 
  fs.writeFileSync('./mountinfo.json', json);
}

function readJsonFileToObject() {
    const jsonString = fs.readFileSync('./mountinfo.json'); // read the JSON file as a string
    const obj = JSON.parse(jsonString); // parse the JSON string into a JavaScript object
    return obj;
}


async function logIn() {

    try {

        

        //let sessionVar;
        //driver.getSession().then((session) =>{
        //    sessionVar = session
        //})
        
        await driver.get("https://sfsu.edu/");

        let masterObject = ({

            client: await driver.getClient().options_

        })
        //console.log(masterObject);
        while (1) {}
        driver.quit();
        //
        

        //await driver.wait(until.elementLocated(By.name('j_username')), 30000000);
        /*
        await driver.findElement(By.xpath("//*[contains(text(), 'Log in to iLearn')]")).sendKeys('webdriver', Key.ENTER);

        
        await driver.wait(until.elementLocated(By.name('j_username')), 30000);
        await driver.wait(until.elementLocated(By.name('j_password')), 30000);
        
        await driver.findElement(By.name("j_username")).sendKeys(process.env.SCHOOL_USER);
        await driver.findElement(By.name("j_password")).sendKeys(process.env.SCHOOL_PASS);
        
        await driver.findElement(By.name("_eventId_proceed")).sendKeys('webdriver', Key.ENTER);

        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'CSC 0415-01 Operating System Principles Spring 2023')]")), 300000);
        
        await writeCookies(driver);
        */
        
        
    } 
    
    finally {
        /*
        const cookies = await driver.manage().getCookies();
        
        driver.on("close", () => {
            console.log("Window closed");
            // Your code to run when the window is closed goes here
        });
        await driver.wait(() => false);
        */

    }
}
logIn();

