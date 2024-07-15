import { createClient } from "@supabase/supabase-js"
import ollama from "ollama"

const api = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oaXRjdnZscWZqbm54dGFjZ3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MDU5OTcsImV4cCI6MjAzNTQ4MTk5N30.AVBzGv4JkcK-KDa8toYBi3V_dOA2DWBxX4iWnN2aq68"
const url =  "https://ohitcvvlqfjnnxtacgtb.supabase.co"
const supabase = createClient(url, api)
const title = 'First post!'
const body = 'Hello world!'
const prompt = "First post! Hello World!"

const embedding = await ollama.embeddings({
    model:"all-minilm",
    prompt: prompt
})

async function select(title,body, embedding){
  try{
    const { data,error } = await supabase.from("documents").insert({
      title: title,
      body: body,
      embedding: embedding,
    })
    console.log("A DATA: ",data)
    return data
  }catch(error){
    console.error("DEU ERRO: ",error)
    return null
  }
}

//await select(title, body, embedding)
let { data: document, erro } = await supabase
  .from('inserir')
  .insert({nome: 'Felipe'})
console.log(document)


let { data: documents, error } = await supabase
  .from('inserir')
  .select('nome')
console.log(documents)

// Store the vector in Postgres
// console.log("INSERT")
// const { data, error } = await supabase.from('documents').insert({
//   title,
//   body,
//   embedding,
// })
