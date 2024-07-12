import ollama from 'ollama'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

async function splitDocument(path){
    const response = await fetch(path)
    const text = await response.text()
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 250,
        chunkOverlap:40
    })
    const output = await splitter.createDocuments([text])
    const textArr = output.map(chunk => chunk.pageContent)
    return textArr
}

const list_chunks = splitDocument("./src/text.txt")

async function embedding(list_chunks){
    const embeddingResponse = await ollama.embeddings({
        model: "mistral-embed",
        prompt: list_chunks,
    })


    const content_embedding = list_chunks.map((chunk, i) => {
        return {
            content: chunk,
            embedding: embeddingResponse.data[i].embedding
        }
    })
    return content_embedding
}

const list_content_embedding = await embedding(list_chunks)
console.log(list_content_embedding)

document.addEventListener("DOMContentLoaded", function(){
    let resposta = document.getElementById("resposta")
    let pergunta = document.getElementById("pergunta")
    let textarea = document.getElementById("prompt-input")
    
    async function gerarResposta(){
        let prompt_txt = textarea.value
        pergunta.innerHTML = prompt_txt
        textarea.value = ""
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
    
    textarea.addEventListener("keydown", async (event) =>{
        if(event.key === "Enter"){
            console.log("Enter Pressionado!!!")
            event.preventDefault()
            await gerarResposta()
            splitDocument("./src/text.txt")
        }
    })

    let btn_prompt = document.getElementById("btn-prompt")
    btn_prompt.addEventListener("click", async () => {
        await gerarResposta();
        splitDocument("./src/text.txt")
    })
})

