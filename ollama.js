import ollama from 'ollama'

document.addEventListener("DOMContentLoaded", function(){
    let resposta = document.getElementById("resposta")
    let pergunta = document.getElementById("pergunta")
    let ask = 'Go Data OMS'
    
    pergunta.innerHTML = ask
    
    async function gerarResposta(){
        let textarea = document.getElementById("prompt-input")
        let prompt_txt = textarea.value
        pergunta.innerHTML = prompt_txt
        try{
            const response = await ollama.chat({
                model:'mistral',
                messages:[{
                    role: 'user',
                    content: prompt_txt 
            }]})
    
            resposta.innerHTML = response.message.content
        }catch(error){
            console.error("Erro ao solicitar a ia: ",error)
        }
    }
    
    let btn_prompt = document.getElementById("btn-prompt")
    btn_prompt.addEventListener("click", async () => {
        await gerarResposta();
    })
})

