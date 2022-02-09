/// AUXILIAR FILE TO CALL getWords FUNCTION
import {getWords} from './wordle'
import { IExistingLetter } from './IExistingLetter'

const language = 'spanish'
const usedLetters = 'tapeoatrassatancisne'
const nLetters = 5

const existingLetters: IExistingLetter[] = [
    {
        letter:'t',
        goodPosition:[],
        badPosition:[0,1,2],
        noExists:[]
    },
    {
        letter:'a',
        goodPosition:[],
        badPosition:[0,1],
        noExists:[3]
    },
    {
        letter:'s',
        goodPosition:[2],
        badPosition:[0,4],
        noExists:[]
    },
    {
        letter:'i',
        goodPosition:[1],
        badPosition:[],
        noExists:[]
    }

]

test()
//bestOpener()

async function test(){
    const data = await getWords(language, nLetters, usedLetters, existingLetters)
    console.log(`Hay ${data.length} palabra/s`)
    console.log(data.words)
}

async function bestOpener(){
    //const opener = await getBestWord(language, nLetters)
    //console.log("opener = ",opener)
}
