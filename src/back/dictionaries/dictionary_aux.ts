import { readFileSync, writeFileSync } from 'fs';
const path = require("path");
import { ILetterStats } from '../IStats'


let language = 'english'
const alphabet = getAlphabet(language)
const nLetters = 5
const original_file = `./original/${language}.txt`
const save_words_file = `./${nLetters}letters/words/${language}.json`
const save_stats_file = `./${nLetters}letters/stats/${language}.json`

createWordsFile()
createStatsFile()

function createWordsFile(): void {
    const data = trimDict(replaceMarkAccents(openFile(original_file)));

    const words = data.split("\n").map(m => m.toLocaleLowerCase())
        .filter(f => f.length === nLetters && testRegex(f))

    saveFile(save_words_file, JSON.stringify(words))
}

function testRegex(text: string): boolean {

    if (alphabet === 'cirilyc') {
        return /^[\wа-я]+$/.test(text)
    } else if (language === 'chinese') {
        // TODO: regex China
    } else if (language === 'greek') {
        // TODO: regex Greece
    } else if (language === 'arabic') {
        // TODO: regex arabic
    } else if (language === 'armeninan'){
        // TODO: regex armenian
    }
    const spanishLetters = 'ñ'
    const frenchLetters = 'çœÿæ'
    const germanLetters = 'ẞ'
    const turkishLetters = 'ğış'
    const foreignLetters = spanishLetters + frenchLetters + germanLetters + turkishLetters
    const regex = new RegExp(`^[a-z${foreignLetters}]+$`)
    return regex.test(text)
}

function openFile(file: string): string {
    return readFileSync(path.resolve(__dirname, file), 'utf-8')
}

function openFileAsJson(file: string) {
    return JSON.parse(readFileSync(path.resolve(__dirname, file), 'utf-8'))
}

function saveFile(file: string, data: string): void {
    writeFileSync(path.resolve(__dirname, file), data)
}

function replaceMarkAccents(str: String): string {
    const map = {
        'á': 'a',
        'à': 'a',
        'â': 'a',
        'å': 'a',
        'ä': 'a',
        'é': 'e',
        'è': 'e',
        'ê': 'e',
        'ë': 'e',
        'í': 'i',
        'ì': 'i',
        'î': 'i',
        'ï':'i',
        'ó': 'o',
        'ò': 'o',
        'ô': 'o',
        'ö': 'o',
        'ø': 'o',
        'ú': 'u',
        'ù': 'u',
        'ü': 'u',
        'û': 'u'
    }
    return str.replace(new RegExp(Object.keys(map).join("|"), "gi"), function (matched) {
        return map[matched.toLowerCase()];
    });
}

function trimDict(str: String): string {
    return str.replaceAll(/\/(.*)|\t(.*)/g, "")
}

function createStatsFile(): void {
    const data = openFileAsJson(save_words_file)// openFile(save_words_file).split('\n')
    let dictionary = {}
    data.forEach(word => {
        word.split("").forEach(letter => {
            dictionary[letter] = dictionary[letter] === undefined ? 1 : dictionary[letter] + 1
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
            weight: totalCurrentLetter / totalLetters
        }
    })
    saveFile(save_stats_file, JSON.stringify(stats, null, 2))
}

function getAlphabet(language: string) : string{

    const alphabets: IAlphabet[] = [
        {
            alphabet: 'latin',
            languages: ['catalan', 'english', 'euskera', 'french', 'galego', 'german', 'italian', 'portuguese', 'spanish', 'swedish', 'turkish']
        }, {
            alphabet: 'cirilyc',
            languages: ['russian']
        },
        {
            alphabet: 'greek',
            languages: ['greek']
        }, {
            alphabet: 'hebrew',
            languages: ['hebrew']
        },
        {
            alphabet: 'chinese',
            languages: ['chinese']
        }, {
            alphabet: 'arabic',
            languages: ['arabic']
        }, {
            alphabet: 'armenian',
            languages: ['armenian']
        }]
    
    for(const alphabet of alphabets){
        if (alphabet.languages.includes(language)) return alphabet.alphabet
    }
    return 'latin'
}

interface IAlphabet {
    alphabet: string,
    languages: string[]
}

