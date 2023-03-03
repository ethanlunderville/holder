require('dotenv').config();
const { execSync } = require('child_process');

const { Builder , By, Key, until, WebDriverWait, on, WebDriver, Capabilities, Options} = require("selenium-webdriver");
const firefox = require('selenium-webdriver/firefox');
const { Command, Name } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/lib/command');
const { Driver, ServiceBuilder, createExecutor } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/firefox');

const { executeCommand, filterNonW3CCaps } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/lib/webdriver');
const { Executor } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/lib/http');
const { DriverService } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/remote/index');
//const { executeCommand, filterNonW3CCaps } = require('/home/ethan/Desktop/selenium/node_modules/selenium-webdriver/remote/index');


//WebDriver.createSession 

let a = function (executor, capabilities, onQuit = undefined) {

    let cmd = new Command(Name.NEW_SESSION)

    cmd.setParameter('capabilities', {
      firstMatch: [{}],
      alwaysMatch: filterNonW3CCaps(capabilities),
    })
    
    let session = executeCommand(executor, cmd)
    
    /*session.then((e)=>{
      console.log(e)
    })
    */
    if (typeof onQuit === 'function') {
      session = session.catch((err) => {
        return Promise.resolve(onQuit.call(void 0)).then((_) => {
          throw err
        })
      })
    }
    return new WebDriver(session, executor, onQuit)
  
}

//Driver.createSession 

let b = function (opt_config, opt_executor) {
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
    let service = new ServiceBuilder().build()
    let updatedService = service.start();
    
    executor = createExecutor(updatedService)
    
    onQuit = () => service.kill()
  }

  return /** @type {!Driver} */ (WebDriver.createSession(executor, caps, onQuit))
}



  

let options = new firefox.Options();
options.addArguments('--disable-blink-features=AutomationControlled');  // maximize the browser window
options.useGeckoDriver(false)

let driver = new Builder().forBrowser("firefox").setFirefoxOptions(options).build()






const fs = require('fs');
const { Session } = require('selenium-webdriver/lib/session');

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
  system('echo "" > /home/ethan/Desktop/selenium/mountinfo.json');

  const json = JSON.stringify(obj); 

  fs.writeFileSync('/home/ethan/Desktop/selenium/mountinfo.json', json);
}

function readJsonFileToObject() {
    const jsonString = fs.readFileSync('/home/ethan/Desktop/selenium/mountinfo.json'); // read the JSON file as a string
    const obj = JSON.parse(jsonString); // parse the JSON string into a JavaScript object
    return obj;
}


async function logIn() {

    try {


         

  

        await driver.get("https://google.com/");
        //while (1) {}
        let sessionVar;
        await driver.getSession().then((session) =>{
            sessionVar = session
            console.log(session);
            //console.log("SESSION VAR:");
            //console.log(sessionVar);
            writeObjectToJsonFile(session);
            //console.log("WRITTEN");
        })
        console.log(driver.getClient().options_)

        let masterObject = ({

            client: await driver.getClient().options_,
            session: sessionVar

        })

        await driver.get("https://google.com/");
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
