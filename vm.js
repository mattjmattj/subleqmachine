
/**
 * Makes an empty VM, composed of a given memory
 * array, a reset program counter and an empty set of IO handlers
 * @param {Array} memory
 * @return {object} vm
 */
const makeVM = (memory) => ({
    memory: memory,
    pc: 0,
    io: {}
})

/**
 * Generates a memory array of the given size, filled with -1
 * (-1 means halting the VM)
 * @param {integer} size
 * @return {Array}
 */
const makeEmptyMemory = (size) => ([...new Array(size)].fill(-1))

/**
 * Generates a fully randomized memory array
 * @param {integer} size 
 * @return {Array}
 */
const makeRandomMemory = (size) => ([...new Array(size)].map(() => Math.round(Math.random() * size-1)))

/**
 * Binds an IO handler to a VM
 * An IO handler must implement
 *  - async read: () -> integer
 *  - async write: integer -> integer
 * 
 * When performing SUBLEQ a b c : 
 *  - the read function will be called on the registered IO hander
 *    for address a, if any. The returned value will be used instead
 *    of the one read from memory
 *  - the write function will be called on the registered IO handler
 *    for address b, receiving a as argument. The returned value will
 *    be used instead of the one read from memory
 *  
 * @param {object} vm 
 * @param {integer} address 
 * @param {object} io 
 * @return {object} vm
 */
function bindIO(vm, address, io) {
    vm.io[address] = io
    return vm
}

/**
 * Performs one SUBLEQ instruction, including calling IO handlers
 * @param {object} vm 
 * @return {object} vm
 */
async function subleq(vm) {
    let a,b,c,valueA

    if (vm.io[vm.memory[vm.pc]]) {
        a = await vm.io[vm.memory[vm.pc]].read()
        //if we read from IO, we read the value, not a memory address
        valueA = a 
    } else {
        a = vm.memory[vm.pc]
        valueA = vm.memory[a]
    }

    if (vm.io[vm.memory[vm.pc+1]]) {
        b = await vm.io[vm.memory[vm.pc+1]].write(valueA)
    } else {
        b = vm.memory[vm.pc+1]
    }

    c = vm.memory[vm.pc+2]

    if (a < 0 || b < 0) {
        vm.pc = -1 //termination
        return vm
    }

    vm.memory[b] -= valueA

    vm.pc = vm.memory[b] > 0 ? vm.pc + 3 : c
    return vm
}

/**
 * Runs a VM for a given maximum amount of SUBLEQ operations
 * @param {object} vm 
 * @param {integer} max 
 */
async function run(vm, max) {
    while (vm.pc >=0 && max>0) {
        vm = await subleq(vm)
        max--
    }
    return vm
}

module.exports = {
    makeVM,
    makeEmptyMemory,
    makeRandomMemory,
    bindIO,
    run
}