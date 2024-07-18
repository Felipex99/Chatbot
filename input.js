import ollama from "ollama"
import { createClient } from "@supabase/supabase-js"

let promptInput = document.getElementById("prompt-input")
const btn_prompt = document.getElementById("btn-prompt")
let pergunta = document.getElementById("pergunta")
let resposta = document.getElementById("resposta")
let star = document.getElementById("loading")
let txt_prompt = ""

const SUPABASE_URL = "https://ohitcvvlqfjnnxtacgtb.supabase.co"
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oaXRjdnZscWZqbm54dGFjZ3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MDU5OTcsImV4cCI6MjAzNTQ4MTk5N30.AVBzGv4JkcK-KDa8toYBi3V_dOA2DWBxX4iWnN2aq68"
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY)

btn_prompt.addEventListener("click", async() =>{
    pergunta.innerHTML = promptInput.value
    resposta.innerHTML = ""
    loading_star("block", "hidden")
    txt_prompt = prompt.value
    console.log("btn Pressionado")
    const conteudo = await exec() 
    await rag(txt_prompt, conteudo)
})

promptInput.addEventListener("keydown", async(event) =>{
    if(event.key === "Enter"){
        pergunta.innerHTML = txt_prompt
        txt_prompt = promptInput.value
        console.log("Enter Pressionado")
        console.log(txt_prompt)
        event.preventDefault()
        loading_star("block","hidden")
        const conteudo = await exec() 
        await rag(txt_prompt, conteudo)
    }
})

async function exec(){
    const embedding_prompt = await createEmbedding(txt_prompt)
    const match_response = await matchResponse(embedding_prompt)
    console.log(txt_prompt)
    console.log(match_response)
    return match_response
}

//1 texto input 
//let textInput = prompt.value
//let textInput = "Qual o nome do autor?"
// let textInput = "Quem escreveu o livro?"
// let textInput = "Qual é a cultura abordada no livro?"
// let textInput = "Qual a função dos Pajés?"
// let textInput = "Quem eram os hekurabe?"


//2 criando o embedding da pergunta

async function createEmbedding(txt){
    const embedding_response = await ollama.embeddings({
        model: "all-minilm",
        prompt: txt
    })
    return embedding_response.embedding
}


//3 recuperando embeddings similares da pergunta

// console.log(match_response)

async function matchResponse(embedding_prompt){
    const { data: documents } = await supabase.rpc("match_ollama_new", {
        query_embedding: embedding_prompt, // Pass the embedding you want to compare
        match_threshold: 0.28, // Choose an appropriate threshold for your data
        match_count: 5, // Choose the number of matches
        })
    return documents
}

async function rag(prompt, content){
    console.log("TO NO RAG \n PROMPT.VALUE: ",prompt.value)
    let all_content = ''
    
    for(let i = 0; i < content.length; i++){
        all_content += content[i].content 
    }

    console.log("ALL_CONTENT: ",all_content)
    const response = await ollama.chat({
        model: "mistral",
        messages: [
            {
                role: "user",
                content: prompt
            },
            {
                role: "system",
                content: all_content
            }
        ]
    })
    loading_star("none", "visible")
    resposta.innerHTML = response.message.content
    return response.message.content
}

function loading_star(star_visibility, question_visibility){
    star.style.display = star_visibility
    resposta.style.visibility = question_visibility
    promptInput.value = ''
}
// const resposta_ia = await rag(textInput, match_response)
// console.log(resposta_ia)