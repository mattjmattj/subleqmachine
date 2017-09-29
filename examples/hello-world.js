/**
 * Prints "HELLO"
 */

const subleq = require('../vm.js')

const printIO = -10

var memory = [
    100, printIO, 3,
    101, printIO, 6,
    102, printIO, 9,
    102, printIO, 12,
    103, printIO, -1,
]

memory[100] = 'H'.charCodeAt(0)
memory[101] = 'E'.charCodeAt(0)
memory[102] = 'L'.charCodeAt(0)
memory[103] = 'O'.charCodeAt(0)

var vm = subleq.makeVM(memory)

subleq.bindIO(vm, printIO, {
    write: function(a) {
        console.log(String.fromCharCode(a))
        return 0
    }
})

subleq.run(vm, 5)
