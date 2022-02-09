document.getElementById('changeLetters').addEventListener('click', () => {
    console.log("entraa")
    document.getElementsByTagName('board-wc')[0].setAttribute('nletters',6)
})

function createData(){
    const board = document.getElementsByTagName("board-wc")
    return board.length > 0 ? board[0].getInputData() : undefined
}

function updateTextArea(words){
    document.getElementById('result-title').textContent = `Hay ${words.length} palabra/s`
    document.getElementById('existing-words').value = words.words
}
