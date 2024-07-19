import  ollama  from "ollama"
import { createClient } from "@supabase/supabase-js"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const apiUrl = "https://ohitcvvlqfjnnxtacgtb.supabase.co"
const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oaXRjdnZscWZqbm54dGFjZ3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTk5MDU5OTcsImV4cCI6MjAzNTQ4MTk5N30.AVBzGv4JkcK-KDa8toYBi3V_dOA2DWBxX4iWnN2aq68"
const supabase = createClient(apiUrl,apiKey)
//1-LER O ARQUIVO DE TEXTO
async function getText(path){
    const document = await fetch(path)
    const text = await document.text()
    return text
}

const text = await getText("src/manualCredenciamento.txt")
console.log(text)
//2-SEPARAR O ARQUIVO DE TEXTO E GERANDO O ARRAY DE TEXTOS
const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize:250,
    chunkOverlap: 40
})

const output = await textSplitter.createDocuments([text])
const textArr = output.map(chunk => chunk.pageContent)

console.log("TextArray: ",textArr[2])

//3-CRIAR OS EMBEDDINGS DOS ARQUIVOS
// async function gerarEmbedding(textArr){
//     const text_list = []
//     console.log(textArr.length)
//     for (let txt in textArr){
//         const embed = await ollama.embeddings({
//             model: "all-minilm",
//             prompt: txt,
//         })
//         text_list.push(embed.embedding)
//     }

//     const content_embedding = textArr.map((chunk, i)=>{
//         return{
//             content:chunk,
//             embedding: text_list[i]            
//         }
//     })
//     return content_embedding
// }

async function gerarEmbedding(textArr){
    const text_list = []
    console.log(textArr.length)
    for (let txt in textArr){
        const embed = await ollama.embeddings({
            model: "all-minilm",
            prompt: txt,
        })
        text_list.push(embed.embedding)
    }

    const content_embedding = textArr.map((chunk, i)=>{
        return{
            id_contexto:4,
            content:chunk,
            embedding: text_list[i]            
        }
    })
    return content_embedding
}

const embeddings = await gerarEmbedding(textArr)
console.log(embeddings)

//4-INSERIR NO BANCO DE DADOS
const {data,error} = await supabase.from("tb_sesapi_cont_manual").insert(embeddings)
if(error){
    console.error(error.message)
}else{
    console.log("Upload de dados bem sucedido!!!")
}