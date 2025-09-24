class Test {
    constructor(){
        this.id = 0;
    }
    getId(){
        return this.id;
    }
    generateNewId(){
        this.id += 1;
        return this.id;
    }
}

const testId = new Test();

export { testId };