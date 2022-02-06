import { readFileSync } from 'fs';
const path = require("path");

/**
 * Ejemplo de letras existentes.
 * Es un array en el que se tiene que indicar la letra y la posición buena y mala:
 *  {
        letter: 'a',
        goodPosition:[0,2],
        badPosition:[1,4]
    }

   Es importante tener en cuenta que se empieza por la posición 0
 */
interface IExistingLetter {
    letter: string,
    goodPosition: number[],
    badPosition: number[]
}

const existingLetters: IExistingLetter[] = []

const existing = existingLetters.map(m => m.letter)
const nonExistingWords = Array.from(
    new Set("".toLocaleLowerCase().split("")
    .filter(f => !existing.includes(f))))

const language = 'spanish'
let file = readFileSync(path.resolve(__dirname, `./dictionaries/${language}.txt`), 'utf-8');

let words = file.split("\n")
words = words.filter(f => 
    f.length === 5 && 
        !(/\d/.test(f)) && 
            /^[a-z]+$/.test(f) &&
                nonExistingWords.every(item => f.indexOf(item) == -1) &&
                    existingLetters.map(m => m.letter).every(e => f.indexOf(e) !== -1))
                    
words = Array.from(new Set(words))
existingLetters.forEach(el => {
    words = words.filter(f => {
        const indexes = f.split("")
            .map(function (c, i) { if (c == el.letter) return i; })
            .filter(function (v) { return v >= 0; })
        return !el.badPosition.some(s => indexes.includes(s)) &&
                el.goodPosition.every(e => indexes.includes(e))
        
    })
})

console.log(`Hay ${words.length} palabra/s`)
console.log(words.join(', '))


