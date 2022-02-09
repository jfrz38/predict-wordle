class KeyboardComponent extends HTMLElement {

    async connectedCallback() {
        const language = this.getAttribute('lang')
        let keyboard = await (await fetch('components/util/keyboard-configuration.json')).json()
        keyboard = keyboard[language] ? keyboard[language] : keyboard['english']
        this.render(keyboard)
    }

    render(keyboard){
        let result = []
        for(const txt of keyboard){
            result.push('<div class="row">')
            for(const letter of txt){
                if(letter === '↵'){
                    result.push('<button letter="↵" class="one-and-a-half submit-button">↵</button>')
                }else if(letter === '←'){
                    result.push('<button data-key="←" class="one-and-a-half">←</button>')
                }else{
                    result.push(`<button letter="${letter}">${letter}</button>`)
                }
            }
            result.push('</div>')
        }
        this.innerHTML = result.join('')
    }
}

window.customElements.define('keyboard-wc', KeyboardComponent);
