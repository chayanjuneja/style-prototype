import fs from "fs"
import path from "path"
import Replicate from "replicate"

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

/* -------- IMAGE GENERATION (REPLICATE FIXED) -------- */

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

const imagePrompt = `fashion model wearing ${result.top}, ${result.bottom}, ${result.shoes}, studio lighting, clean background`

console.log("IMAGE PROMPT:", imagePrompt)

let imageUrl = ""

try {
  const prediction = await replicate.predictions.create({
    version: "stability-ai/sdxl:latest",
    input: {
      prompt: imagePrompt
    }
  })

  console.log("PREDICTION:", prediction)

  let resultPrediction = prediction

  while (
    resultPrediction.status !== "succeeded" &&
    resultPrediction.status !== "failed"
  ) {
    await new Promise(r => setTimeout(r, 1000))

    resultPrediction = await replicate.predictions.get(
      prediction.id
    )
  }

  console.log("FINAL PREDICTION:", resultPrediction)

  if (resultPrediction.status === "succeeded") {
    imageUrl = resultPrediction.output?.[0] || ""
  }

} catch (err) {
  console.error("REPLICATE ERROR:", err)
}

result.image = imageUrl
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