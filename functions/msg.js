export async function onRequest({env,request}){
  const key="msgboard"
  if(request.method==="POST"){
    const {c}=await request.json()
    const oldData=await env.MSG.get(key)
    const list=oldData ? JSON.parse(oldData) : []
    list.push({c,t:new Date().toLocaleString()})
    if(list.length>30) list.shift()
    await env.MSG.put(key,JSON.stringify(list))
    return Response.json({ok:true})
  }else{
    const raw=await env.MSG.get(key)
    return Response.json(raw ? JSON.parse(raw) : [])
  }
}
