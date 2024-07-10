import MistralClient from "@mistralai/mistralai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
const apiKey = process.env.MISTRAL_API_KEY || "U6U54WPhLGVyXafmZjZjDq0NwODNX9pk"
const client = new MistralClient(apiKey)
let text  = ""
let list_chunks = []
let list_cont_emb = []
let resposta = document.getElementById("resposta")
async function getText(path){
  const document = await fetch(path)
  const text = await document.text()
  return text
}
text = await getText("text.txt")

async function textSplitter(){
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 250,
    chunkOverlap: 40
  })
  const output = await textSplitter.createDocuments([text])
  const textArr = output.map(chunk => chunk.pageContent)
  return textArr
}

list_chunks = await textSplitter()

async function embed(pedaco){
  const embeddingResponse = await client.embeddings({
    model: "mistral-embed",
    input: pedaco
  })
  const cont_emb = pedaco.map((chunk,i)  => {
    return{
      content:chunk,
      embedding: embeddingResponse.data[i].embedding
    }
  })
  return cont_emb
}
list_cont_emb = await embed(list_chunks)
console.log(list_cont_emb[1])




resposta = await resposta.innerHTML(embed(list_chunks))