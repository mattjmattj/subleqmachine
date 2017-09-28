/**
 * Uses a naive local search heuristic to generate a 100 instruction SUBLEQ program (memory)
 * that will print "Hello!" in less than 50 steps
 * It binds a unique IO handler that stores any generated characters
 */

const subleq = require('../vm.js')
const levenshtein = require('fast-levenshtein')
const padend = require('string.prototype.padend')

function randomlyMutateMemory(memory) {
    var nbMutations = Math.round(Math.random() * 30)
    while (nbMutations--) {
        memory[Math.round(Math.random() * memLength)] = Math.round(Math.random() * memLength - 1)
    }
    return memory
}

const memLength = 100
const printIO = 99

var memory = subleq.makeRandomMemory(memLength)
var bestMemory = memory
var bestDistance = Infinity
var bestMsg = ''

const target = process.argv[2] || 'Hello!'
var nb = 0

while (true) {
    nb++
    const vm = subleq.makeVM(memory.slice())

    let msg = ''

    subleq.bindIO(vm, printIO, {
        write: function (a) {
            msg += String.fromCharCode(a)
            return 0
        },

        read: function () {
            return -1
        }
    })

    subleq.run(vm, 50)

    const distance = levenshtein.get(msg, target)
    if (distance <= bestDistance) {
        bestMemory = memory.slice()
        bestDistance = distance
        if (bestMsg != msg) {
            bestMsg = msg
            console.log('>', msg)
        }

        if (distance == 0) {
            break;
        }
    }
    memory = randomlyMutateMemory(bestMemory.slice())
}

console.log(bestMemory, nb)
