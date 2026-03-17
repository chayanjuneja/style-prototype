import fs from "fs"
import path from "path"

export async function POST(req: Request) {

  const { prompt } = await req.json()

  const filePath = path.join(process.cwd(),"data","store.json")

  const store = JSON.parse(fs.readFileSync(filePath,"utf8"))

  const profile = store.profile

 const enhancedPrompt = `
User style profile:
${JSON.stringify(profile)}

User request:
${prompt}

Return JSON ONLY.

Format exactly like this:

{
"top":"",
"bottom":"",
"shoes":"",
"accessories":"",
"confidence":0,
"reason":""
}
`

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        model:"llama-3.1-8b-instant",
        messages:[
          {
            role:"system",
            content:"You are a professional fashion stylist."
          },
          {
            role:"user",
            content:enhancedPrompt
          }
        ]
      })
    }
  )

  const data = await response.json()

  const aiText = data?.choices?.[0]?.message?.content || "{}"

let result

try{
 result = JSON.parse(aiText)
}catch{
 result = {error:"AI parse failed"}
}


/* ---------------- SAVE HISTORY ---------------- */

store.history.push({
  prompt,
  result,
  timestamp:Date.now()
})
  fs.writeFileSync(filePath,JSON.stringify(store,null,2))
console.log("IMAGE VALUE:", result.image)  
console.log("FINAL RESULT:", result)
  return Response.json( result )
}