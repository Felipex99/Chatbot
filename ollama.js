import ollama from 'ollama'

document.addEventListener("DOMContentLoaded", function(){
    let resposta = document.getElementById("resposta")
    let pergunta = document.getElementById("pergunta")
    
    async function gerarResposta(){
        let textarea = document.getElementById("prompt-input")
        let prompt_txt = textarea.value
        pergunta.innerHTML = prompt_txt
        try{
            const response = await ollama.chat({
                model:'mistral',
                stream:true,
                messages:[{
                    role: 'user',
                    content: prompt_txt 
            }]})
            
            
            await new Promise(resolve => setTimeout(resolve,1000))
            
            
            
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

