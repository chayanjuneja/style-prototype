"use client"

import { useState, useEffect } from "react"

export default function Home() {

  const [prompt,setPrompt] = useState("")
  const [result,setResult] = useState<any>(null)
  const [loading,setLoading] = useState(false)
  const [event,setEvent] = useState("work")
  const [history,setHistory] = useState([])
  const [image,setImage] = useState("")
  
  async function generate(){

    setLoading(true)

    const res = await fetch("/api/style",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({
  prompt: `Event: ${event}. ${prompt}`
})
    })

    const data = await res.json()
    
    console.log("FULL RESPONSE:", data) 

    setResult(data)
    setImage(data.image)
    setLoading(false)
  }
  useEffect(()=>{
fetch("/api/history")
.then(res=>res.json())
.then(data=>setHistory(data.slice(-3).reverse()))
},[result])

const confidence = result?.confidence || 8

  return (

<div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-900 text-white flex flex-col items-center p-10 gap-10">
<div className="text-purple-500 font-semibold tracking-widest">
Eveo AI Prototype
</div>
<h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent text-center leading-tight mb-2">AI Style Copilot
</h1>

<p className="text-gray-400 text-center max-w-xl">
AI-powered outfit recommendations for events, meetings, and daily life.
</p>

<div className="backdrop-blur-xl bg-slate-900/70 border border-purple-500/30 p-8 rounded-2xl shadow-2xl w-[520px] flex flex-col gap-5">

<select
className="bg-slate-900 text-white border border-purple-500/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 p-2 rounded-lg outline-none"
value={event}
onChange={(e)=>setEvent(e.target.value)}
>
<option value="work">Work</option>
<option value="date">Date</option>
<option value="party">Party</option>
<option value="casual">Casual</option>
</select>
<select
className="bg-slate-900 text-white border border-purple-500/40 p-2 rounded-lg"
>
<option value="minimal">Minimal</option>
<option value="classic">Classic</option>
<option value="street">Streetwear</option>
<option value="luxury">Luxury</option>
</select>

<textarea
className="w-full h-[120px] p-4 rounded-lg bg-slate-900 text-white border border-purple-500/40 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/40 outline-none placeholder:text-gray-400"placeholder="Example: I have a startup pitch tomorrow and want a minimal professional outfit."
value={prompt}
onChange={(e)=>setPrompt(e.target.value)}
/>
<div className="flex gap-2 flex-wrap">

<button
className="text-sm bg-slate-800 px-3 py-1 rounded border border-purple-500/30 hover:bg-slate-700"
onClick={()=>setPrompt("I have a startup pitch tomorrow")}
>
Startup Pitch
</button>

<button
className="text-sm bg-slate-800 px-3 py-1 rounded border border-purple-500/30 hover:bg-slate-700"
onClick={()=>setPrompt("First date dinner outfit")}
>
First Date
</button>

<button
className="text-sm bg-slate-800 px-3 py-1 rounded border border-purple-500/30 hover:bg-slate-700"
onClick={()=>setPrompt("Casual Friday outfit")}
>
Casual Friday
</button>

</div>
<button
onClick={generate}
className="bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 hover:scale-[1.02] px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg"
>
Generate Outfit
</button>

</div>

{loading && <p className="text-gray-400">Thinking...</p>}

{result && (
<div className="bg-slate-900 border border-purple-600 p-8 rounded-xl shadow-xl max-w-xl">

<h2 className="text-xl font-semibold text-purple-400 mb-6">
AI Recommendation
</h2>

<div className="grid grid-cols-2 gap-4 text-sm">

<div className="bg-slate-800 p-4 rounded">
<p className="text-gray-400">Top</p>
<p>{result?.top}</p>
</div>

<div className="bg-slate-800 p-4 rounded">
<p className="text-gray-400">Bottom</p>
<p>{result?.bottom}</p>
</div>

<div className="bg-slate-800 p-4 rounded">
<p className="text-gray-400">Shoes</p>
<p>{result?.shoes}</p>
</div>

<div className="bg-slate-800 p-4 rounded">
<p className="text-gray-400">Accessories</p>
<p>{result?.accessories}</p>
</div>

</div>

<div className="mt-6">
<p className="text-sm text-gray-400 mb-1">Confidence</p>
<div className="w-full bg-gray-800 rounded-full h-2">
<div
className="bg-purple-500 h-2 rounded-full"
style={{ width: `${confidence * 10}%` }}
></div>
</div>
</div>
<div className="mt-6 text-sm text-gray-300">
<p className="text-purple-300 mb-1">Why this outfit works</p>
<p>{result?.reason}</p>
</div>

{image && (
  <div className="mt-6">
    <p className="text-purple-300 mb-2">Generated Outfit</p>
    <img
      src={image}
      alt="Generated outfit"
      className="rounded-xl border border-purple-500/40 shadow-lg w-full object-cover"
    />
  </div>
)}
</div>
)}
<div className="mt-8 max-w-xl w-full">

<h3 className="text-purple-400 mb-3 text-lg font-semibold">
Recent Outfits
</h3>

{history.map((item:any,i:number)=>(
<div
key={i}
className="bg-slate-900 border border-purple-500/30 p-3 rounded mb-2 text-sm"
>
{item.prompt}
</div>
))}

</div>
</div>

)
}