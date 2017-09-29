/**
 * Prompts for 2 numbers and sums them
 */
var prompt = require('prompt')

const subleq = require('../vm.js')

const printIO = -10
const promptIO = -20

prompt.start()

const pACC=12
const pSUM=13

var memory = [
    /*CODE*/
/*0*/ promptIO, pACC, 3, /* ACC = -(prompt A)*/
/*3*/ promptIO, pACC, 6, /* ACC = -(prompt A) -(prompt B) */
/*6*/ pACC, pSUM, 9, /* SUM = -ACC */
/*9*/ pSUM, printIO, -1, /* print SUM, FIN */
    /*DATA*/
/*12*/0, /* ACC */
/*13*/0, /* SUM */
]

var vm = subleq.makeVM(memory)

subleq.bindIO(vm, printIO, {
    write: function(a) {
        console.log(a)
        return 0
    }
})

subleq.bindIO(vm, promptIO, {
    read: function(a) {
        return new Promise(function(resolve, reject) {
            prompt.get(['value'], function (err, result) {
                if (err) {
                    reject(err)
                } else {
                    resolve(result.value)
                }
              });
        })
    }
})

subleq.run(vm, 4)
