import ollama from 'ollama'
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://ohitcvvlqfjnnxtacgtb.supabase.co"
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oaXRjdnZscWZqbm54dGFjZ3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MDU5OTcsImV4cCI6MjAzNTQ4MTk5N30.AVBzGv4JkcK-KDa8toYBi3V_dOA2DWBxX4iWnN2aq68"
const supabase = createClient(SUPABASE_URL , SUPABASE_API_KEY)

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

const list_chunks = await splitDocument("./src/text.txt")


async function embedding(list_chunks){
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

await supabase.from("text").insert(list_content_embedding)
console.log("Data Uploaded!!!")