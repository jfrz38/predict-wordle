import { readFileSync, writeFileSync } from 'fs';
const path = require("path");
import { ILetterStats } from '../IStats'

const language = 'turkish'
const nLetters = 5
const original_file = `./original/${language}.txt`
const save_words_file = `./${nLetters}letters/words/${language}.txt`
const save_stats_file = `./${nLetters}letters/stats/${language}.json`

createWordsFile()
createStatsFile()

function createWordsFile(): void{
    const data = trimDict(replaceMarkAccents(openFile(original_file)));

    const words = data.split("\n").filter(f => 
        f.length === nLetters && 
            /^[a-z]+$/.test(f))
                .map(m => m.toLocaleLowerCase())
    saveFile(save_words_file, words.join('\n'))
}

function openFile(file: string): string{
    return readFileSync(path.resolve(__dirname, file), 'utf-8')
}

function saveFile(file: string, data: string): void{
    writeFileSync(path.resolve(__dirname, file), data)
}

function replaceMarkAccents(str: String): string{
    const map = {
        'á':'a',
        'à':'a',
        'â':'a',
        'å':'a',
        'ä':'a',
        'é':'e',
        'è':'e',
        'ê':'e',
        'í':'i',
        'ì':'i',
        'î':'i',
        'ó':'o',
        'ò':'o',
        'ô':'o',
        'ö':'o',
        'ø':'o',
        'ú':'u',
        'ù':'u',
        'ü':'u',
        'û':'u'
    }
    return str.replace(new RegExp(Object.keys(map).join("|"),"gi"), function(matched){
        return map[matched.toLowerCase()];
    });
}

function trimDict(str: String): string{
    return str.replaceAll(/\/(.*)|\t(.*)/g,"")
}

function createStatsFile(): void{
    const data = openFile(save_words_file).split('\n')
    let dictionary = {}
    data.forEach(word => {
        word.split("").forEach(letter => {
            dictionary[letter] = dictionary[letter] === undefined ? 1 : dictionary[letter]+1
        })
    })
    
    const totalLetters = Object.keys(dictionary).reduce(function (previousValue, currentLetter) {
        return previousValue + dictionary[currentLetter]
    }, 0)

    const stats: ILetterStats = {}
    Object.keys(dictionary).forEach(letter => {
        const totalCurrentLetter = dictionary[letter]
        stats[letter] = {
            total: dictionary[letter],
            weight: totalCurrentLetter/totalLetters
        }
    })
    saveFile(save_stats_file, JSON.stringify(stats, null, 2))
}

