class BoardComponent extends HTMLElement {

    inputs = []
    backgrounds = ['', 'orange','green']

    static get observedAttributes(){
        return ['nletters']
    }

    connectedCallback() {
        this.render()
    }

    attributeChangedCallback(){
        this.render()
    }

    render(){
        this.innerHTML = ''
        console.log("ENTRA RENDER")
        const nLetters = this.getAttribute('nletters')
        let inputs = this.inputs = []
        const oportunities = 6
        for(let i = 0; i < oportunities; i++){
            var div = document.createElement('div')
            var row = []
            for(let j = 0; j < nLetters ; j++){
                var input = document.createElement('input')
                input.setAttribute('row', i)
                input.setAttribute('column', j)
                input.setAttribute('maxLength', 1)
                input.setAttribute('id', `input${i}-${j}`)
                input.addEventListener('change', this)
                input.addEventListener('click',this)
                if(i !== 0) input.disabled = true
                else input.disabled = false
                div.appendChild(input)
                row.push(input)
            }
            inputs.push(row)
            this.appendChild(div)
        }
        this.inputs[0][0].focus()
    }

    handleEvent(event){
        if(event.target.tagName === 'INPUT') {
            if(event.type === 'change'){
                this.disableInputs(event.target)
            }else if(event.type === 'click'){
                this.changeColorInputs(event.target)
            }
        }
    }

    disableInputs(input){
        this.validateEntry(input)
        let row = parseInt(input.getAttribute('row'))
        const allChecked = this.inputs[row].map(m => m.value).every(s => s.length === 1)
        if(allChecked) {
            if(row === this.inputs.length - 1) return
            this.inputs[++row].map(m => m.disabled = false)
        }

        if(input.value === ''){
            input.style.backgroundColor = ''
        }
    }

    changeColorInputs(input){
        if(input.value === '') return
        let index = this.backgrounds.findIndex(i => i === input.style.backgroundColor)
        input.style.backgroundColor = this.backgrounds[++index%(this.backgrounds.length)]
    }

    validateEntry(input){
        if(input.value === ' ') input.value = ''
        if(/^([0-9])$/.test(input.value)) input.value = ''
    }

    getInputData(){
        let response = []
        let usedLetters = ''

        for(let row of this.inputs){
            for(let i = 0; i < row.length ; i++){
                const cell = row[i]
                const letter = cell.value
                if(!letter) continue
                else usedLetters += letter
                
                const background = cell.style.backgroundColor
                const foundLetter = response.find(f => f.letter === letter)
                if(foundLetter){
                    if(background === '') foundLetter.noExists.push(i)
                    if(background === 'orange') foundLetter.badPosition.push(i)
                    if(background === 'green') foundLetter.goodPosition.push(i)
                }else{
                    if(background !== ''){
                        const obj = {
                            letter: letter,
                            goodPosition:[],
                            badPosition:[],
                            noExists:[]
                        }
                        if(background === 'orange') obj.badPosition.push(i)
                        if(background === 'green') obj.goodPosition.push(i)

                        response.push(obj)
                    }
                }
            }
        }
        return {
            existingLetters: response,
            usedLetters: usedLetters
        }

    }
}

window.customElements.define('board-wc', BoardComponent);
