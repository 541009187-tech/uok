export async function onRequest({env,request}){
  const key="msgboard"
  if(request.method==="POST"){
    // 新增留言
    const {c,nick}=await request.json()
    const oldData=await env.MSG.get(key)
    const list=oldData ? JSON.parse(oldData) : []
    list.push({c,t:new Date().toLocaleString(), nick:nick})
    if(list.length>30) list.shift()
    await env.MSG.put(key,JSON.stringify(list))
    return Response.json({ok:true})
  }else if(request.method==="DELETE"){
    // 删除留言
    const {idx}=await request.json()
    const oldData=await env.MSG.get(key)
    const list=oldData ? JSON.parse(oldData) : []
    list.splice(idx,1)
    await env.MSG.put(key,JSON.stringify(list))
    return Response.json({ok:true})
  }else{
    // 获取全部留言
    const raw=await env.MSG.get(key)
    return Response.json(raw ? JSON.parse(raw) : [])
  }
}
