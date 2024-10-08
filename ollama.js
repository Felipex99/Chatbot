import ollama from 'ollama'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { createClient } from '@supabase/supabase-js'


const supabase = createClient(SUPABASE_URL , SUPABASE_API_KEY)



async function splitDocument(path){
    console.log("Etapa 1/5 concluída")
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

const list_chunks = await splitDocument("./src/text.txt")


async function embedding(list_chunks){
    console.log("Etapa 2/5 concluída")
    
    const text_list = []
    let embeddingResponse = []
    
    for(let i = 0;i < list_chunks.length;i++){
        embeddingResponse = await ollama.embeddings({
            model: "all-minilm",
            prompt: list_chunks[i],
        })
        text_list.push(embeddingResponse.embedding)
    }
    
    const content_embedding = list_chunks.map((chunk, i) => {
        return {
            content: chunk,
            embedding: text_list[i]
        }
    })    
    return content_embedding
}

const list_content_embedding = await embedding(list_chunks)

//document.addEventListener("DOMContentLoaded", function(){
    console.log("Etapa HTML 3/5 concluída")
    let resposta = document.getElementById("resposta")
    let pergunta = document.getElementById("pergunta")
    let textarea = document.getElementById("prompt-input")
    
    async function gerarResposta(){
        console.log("Etapa 4/5 concluída")
        
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
//})

await supabase.from("text").insert(list_content_embedding)
console.log("Data Uploaded!!!")