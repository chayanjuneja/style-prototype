import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(),"data","store.json")

export async function GET(){

  const store = JSON.parse(fs.readFileSync(filePath,"utf8"))

  return Response.json(store.profile)

}

export async function POST(req:Request){

  const body = await req.json()

  const store = JSON.parse(fs.readFileSync(filePath,"utf8"))

  store.profile = body

  fs.writeFileSync(filePath,JSON.stringify(store,null,2))

  return Response.json({status:"saved"})
}