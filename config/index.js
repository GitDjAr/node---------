// import { run } from './dep.config.js'
// run()

function run() {
  return new Error('错误1')
  // return new Promise((resolve, reject) => {
  //   reject(new Error('错误'))
  // })
}
async function run2() {
  return new Error('错误2')
}

async function run3() {
  try {
    let a = await run()
    await run2()
    console.log(a);
  } catch (error) {
    console.log(error);
  }

}
run3()
console.log(process.cwd());