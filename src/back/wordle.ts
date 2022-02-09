import { ILetterStats, IWordStats } from './IStats'
import { IExistingLetter, IResult } from './IExistingLetter'

export async function getWords(language: string, nLetters:number, usedLetters:string, existingLetters: IExistingLetter[]): Promise<IResult> {
    const words: string[] = await getMatchedWords(language, nLetters, usedLetters, existingLetters)
    const sortedWords = await sortWordsByHeight(language, nLetters, words)
    return  {
        length: words.length,
        words: sortedWords.join(', ')
    }
}

async function getMatchedWords(language: string, nLetters: number, usedLetters: string, existingLetters: IExistingLetter[]): Promise<string[]>{

    const existing: string[] = existingLetters.map(m => m.letter)
    const nonExistingWords: string[]= Array.from(
        new Set(usedLetters.toLocaleLowerCase().split("")
        .filter(f => !existing.includes(f))))
    
    let words: string[] = (await getWordsList(language, nLetters)).filter(f => 
        nonExistingWords.every(item => f.indexOf(item) == -1) &&
            existingLetters.map(m => m.letter).every(e => f.indexOf(e) !== -1))
    
    words = Array.from(new Set(words))
    existingLetters.forEach(el => {
        words = words.filter(f => {
            const indexes = f.split("")
                .map(function (c, i) { if (c == el.letter) return i; })
                .filter(function (v) { return v >= 0; })
            return !el.badPosition.some(s => indexes.includes(s)) &&
                    el.goodPosition.every(e => indexes.includes(e)) &&
                    !el.noExists.some(s => indexes.includes(s))
            
        })
    })
    return words
}

async function sortWordsByHeight(language: string, nLetters: number, words:string[]): Promise<string[]>{
    const stats: ILetterStats = await getStats(language, nLetters)
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
    return wordsSorted.sort((a,b) => b.weight - a.weight).map(w => w.word)
    // TODO: Como sugerencia se puede devolver en otro orden
    // TODO: Ordenadas también primero por palabras que todas sus letras sean diferentes
    // TODO: Esto habría que mirarlo mejor porque "todas sus letras" = todas letras-ya puestas (es decir, que las ya puestas sí se pueden repetir sin alterar el orden)
}

async function getWordsList(language: string, nLetters: number): Promise<string[]> {
    return await getFileData(language, nLetters, 'words')
}

async function getStats(language: string, nLetters: number): Promise<ILetterStats> {
    return await getFileData(language, nLetters, 'stats')
}

async function getFileData(language: string, nLetters: number, type: string):Promise<any> {
    return (await import(`./dictionaries/${nLetters}letters/${type}/${language}.json`)).default
}
