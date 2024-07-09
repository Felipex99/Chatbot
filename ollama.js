import ollama from 'ollama'

let resposta = document.getElementById("resposta")
let pergunta = document.getElementById("pergunta")
let ask = 'O que é o Go Data da OMS?'
const response = await ollama.chat({
    model:'mistral',
    messages:[{
        role: 'user',
        content: ask
    }]
})

pergunta.innerHTML = ask
resposta.innerHTML = response.message.content
console.log("Resposta>>")
console.log(response.message.content)