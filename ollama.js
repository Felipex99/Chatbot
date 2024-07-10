<<<<<<< HEAD
=======
// import ollama from 'ollama'

// let resposta = document.getElementById("resposta")
// let pergunta = document.getElementById("pergunta")

// async function gerarResposta(){
//     let textarea = document.getElementById("prompt-input")
//     let prompt_txt = textarea.value
//     pergunta.innerHTML = prompt_txt
//     try{
//         const response = await ollama.chat({
//             model:'mistral',
//             stream:true,
//             messages:[{
//                 stream: true,
//                 role: 'user',
//                 content: prompt_txt 
//         }]})
//         console.log("aiiiiiiiiiiiiiiiiiiiii")
//         resposta.innerHTML = response.message.content;

//     }catch(error){
//         console.error("Erro ao solicitar a ia: ",error)
//     }
// }

// let btn_prompt = document.getElementById("btn-prompt")
// btn_prompt.addEventListener("click", async () => {
//     gerarResposta();
// })

>>>>>>> f2a60ea00c66b4c0ed875e7e485cf21afee6ccc4
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
<<<<<<< HEAD
                stream:true,
=======
>>>>>>> f2a60ea00c66b4c0ed875e7e485cf21afee6ccc4
                messages:[{
                    role: 'user',
                    content: prompt_txt 
            }]})
<<<<<<< HEAD
            
            
            await new Promise(resolve => setTimeout(resolve,1000))
            
            
=======
                        
>>>>>>> f2a60ea00c66b4c0ed875e7e485cf21afee6ccc4
            
            resposta.innerHTML = response.message.content
        }catch(error){
            console.error("Erro ao solicitar a ia: ",error)
        }
<<<<<<< HEAD
    }
    
=======
        textarea.addEventListener("keydown", async (event) =>{
            if(event.key === "Enter"){
                console.log("Enter Pressionado!!!")
                event.preventDefault()
                await gerarResposta()
            }
        })
    }
    

>>>>>>> f2a60ea00c66b4c0ed875e7e485cf21afee6ccc4
    let btn_prompt = document.getElementById("btn-prompt")
    btn_prompt.addEventListener("click", async () => {
        await gerarResposta();
    })
})

