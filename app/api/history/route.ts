import fs from "fs"
import path from "path"

export async function GET(){

  const filePath = path.join(process.cwd(),"data","store.json")

  const store = JSON.parse(fs.readFileSync(filePath,"utf8"))

  return Response.json(store.history)
}