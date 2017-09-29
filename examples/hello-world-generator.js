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


const target = process.argv[2] || 'Hello!'
var nb = 0

async function run (memory, bestMemory, bestMsg, bestDistance, nb) {
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

    await subleq.run(vm, 50)

    const distance = levenshtein.get(msg, target)

    if (distance == 0) { //we have it !
        console.log(memory, nb)
        return 
    }

    if (distance <= bestDistance) {
        run(
            randomlyMutateMemory(bestMemory.slice()),
            memory.slice(),
            bestMsg != msg ? msg : bestMsg,
            distance,
            nb+1
        )
        console.log('>', msg)
    } else {
        run(
            randomlyMutateMemory(bestMemory.slice()),
            bestMemory,
            bestMsg,
            bestDistance,
            nb+1
        )
    }
}


var memory = subleq.makeRandomMemory(memLength)
run(memory, memory, '', Infinity, 0)