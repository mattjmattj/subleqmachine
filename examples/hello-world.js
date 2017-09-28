/**
 * Prints "HELLO"
 */

const subleq = require('../vm.js')

const printIO = -10

var memory = subleq.makeEmptyMemory(100)

var ptr = 0
for (let c of ['H','E','L','L','O']) {
    // 'H' printIO _ 'E' printIO _ ...
    memory[ptr] = c.charCodeAt(0)
    memory[ptr+1] = printIO
    ptr += 3
}

var vm = subleq.makeVM(memory)

subleq.bindIO(vm, printIO, {
    write: function(a) {
        console.log(String.fromCharCode(a))
        return 0
    }
})

subleq.run(vm, 5)
