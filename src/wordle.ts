import { readFileSync } from 'fs';
const path = require("path");
import { ILetterStats, IWordStats } from './IStats'
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
    badPosition: number[],
}

const language = 'spanish'
const usedLetters = ''
const nLetters = 5

const existingLetters: IExistingLetter[] = []

const words: string[] = getMatchedWords()

const wordsSorted: IWordStats[] = sortWordsByHeight(language, nLetters, words)

console.log(`Hay ${wordsSorted.length} palabra/s`)
console.log(wordsSorted.map(w => w.word).join(', '))

function getWordsList(language: string, nLetters: number): string[] {
    return readFileSync(path.resolve(__dirname, `./dictionaries/${nLetters}letters/words/${language}.txt`), 'utf-8').split("\n");
}

function getMatchedWords(): string[]{

    const existing = existingLetters.map(m => m.letter)
    const nonExistingWords = Array.from(
        new Set(usedLetters.toLocaleLowerCase().split("")
        .filter(f => !existing.includes(f))))

    let words = getWordsList(language, nLetters).filter(f => 
        !(/\d/.test(f)) && 
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
    return words
}

function sortWordsByHeight(language: string, nLetters: number, words:string[]): IWordStats[]{
    const stats: ILetterStats = getStats(language, nLetters)
    const wordsSorted: IWordStats[] = []
    words.forEach(word => {
        let totalWeight = 0
        for(let letter of word){
            totalWeight += stats[letter].weight
        }
        wordsSorted.push({
            word: word,
            weight: totalWeight
        })
    })
    return wordsSorted.sort((a,b) => b.weight - a.weight)
}

function getStats(language: string, nLetters: number): ILetterStats {
    const data = readFileSync(path.resolve(__dirname, `./dictionaries/${nLetters}letters/stats/${language}.json`), 'utf-8');
    return JSON.parse(data)
}
