export async function onRequest({env,request}){
  const key="msgboard"
  const ADMIN_NAME = "windows"

  if(request.method==="POST"){
    const {c,nick}=await request.json()
    const oldData=await env.MSG.get(key)
    const list=oldData ? JSON.parse(oldData) : []
    list.push({c,t:new Date().toLocaleString(), nick:nick})
    if(list.length>30) list.shift()
    await env.MSG.put(key,JSON.stringify(list))
    return Response.json({ok:true})
  }else if(request.method==="DELETE"){
    const {idx,nick}=await request.json()
    const oldData=await env.MSG.get(key)
    const list=oldData ? JSON.parse(oldData) : []
    const targetMsg = list[idx]
    if(!targetMsg) return Response.json({ok:false,msg:"留言不存在"},{status:400})

    // 后端权限判断
    const isAdmin = nick === ADMIN_NAME
    const isOwner = targetMsg.nick === nick
    if(!isAdmin && !isOwner){
      return Response.json({ok:false,msg:"无权限删除"},{status:403})
    }

    list.splice(idx,1)
    await env.MSG.put(key,JSON.stringify(list))
    return Response.json({ok:true})
  }else{
    const raw=await env.MSG.get(key)
    return Response.json(raw ? JSON.parse(raw) : [])
  }
}
