import { readFileSync, writeFileSync } from 'fs';
const path = require("path");

const language = 'spanish'
const original_file = `./dictionaries/original/${language}.txt`
const save_file = `./dictionaries/${language}.txt`
const data = trimPortuguese(replaceAll(readFileSync(path.resolve(__dirname, original_file), 'utf-8')));

const words = data.split("\n").filter(f => f.length === 5).map(m => m.toLocaleLowerCase())
writeFileSync(path.resolve(__dirname, save_file), words.join('\n'))

function replaceAll(str: String): string{
    const map = {
        'á':'a',
        'à':'a',
        'â':'a',
        'é':'e',
        'è':'e',
        'ê':'e',
        'í':'i',
        'ì':'i',
        'î':'i',
        'ó':'o',
        'ò':'o',
        'ô':'o',
        'ú':'u',
        'ù':'u',
        'ü':'u',
        'û':'u'
    }
    var re = new RegExp(Object.keys(map).join("|"),"gi");

    return str.replace(re, function(matched){
        return map[matched.toLowerCase()];
    });
}

function trimPortuguese(str: String): string{
    return str.replaceAll(/\/(.*)|\t(.*)/g,"")
}
