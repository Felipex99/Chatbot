import ollama from "ollama"
import { createClient } from "@supabase/supabase-js"

let prompt = document.getElementById("prompt-input")
const btn_prompt = document.getElementById("btn-prompt")
let pergunta = document.getElementById("pergunta")
let resposta = document.getElementById("resposta")



const SUPABASE_URL = "https://ohitcvvlqfjnnxtacgtb.supabase.co"
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oaXRjdnZscWZqbm54dGFjZ3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MDU5OTcsImV4cCI6MjAzNTQ4MTk5N30.AVBzGv4JkcK-KDa8toYBi3V_dOA2DWBxX4iWnN2aq68"
const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY)
// await test()
// async function test(){
//     const {data, error } = await supabase.from("ollama").select()
//     if(error){
//         console.error(error.message)
//     }else{
//         console.log("DADOS DO SELECT: ",data)
//     }
// }
// async function funcao(){
//     const { data: documents } = await supabase.rpc('match_text')
//     console.log("DOCUMENTS: ",documents)
// }
// await funcao()



//1 texto input 
//let textInput = prompt.value
let textInput = "Qual é o nome do autor?"
//2 criando o embedding da pergunta

async function createEmbedding(textInput){
    const embedding_response = await ollama.embeddings({
        model: "all-minilm",
        prompt: textInput
    })
    return embedding_response
}
const embedding_prompt = await createEmbedding(textInput)

//3 recuperando embeddings similares da pergunta
const match_response = await matchResponse(embedding_prompt)

async function matchResponse(embedding_prompt){
    console.log("entrei no match response:: ",embedding_prompt)
    const { data:documents } = await supabase.rpc("match_ollama", {
    query_embedding: embedding_prompt, // Pass the embedding you want to compare
    match_threshold: 0.78, // Choose an appropriate threshold for your data
    match_count: 1, // Choose the number of matches
    })
    console.log(embedding_prompt)
    return documents
}