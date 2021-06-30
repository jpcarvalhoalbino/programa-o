const { response }= require ('express')
const express= require ('express')
const app =express()
app.use(express.json())
const uuid= require('uuid')

let trabalhadores =[
    {id:uuid.v4(), nome:'joao', funcao:'tecnico',salario:2000, inss:200, irf:140,fgts:160,salliq:1660},
    {id:uuid.v4(), nome:'pedro', funcao:'suporte',salario:3000,inss:360, irf:210,fgts:240,salliq:2430}
]


const checaId = (request, response, next)=>{
    const {id}=request.params
    const olhaId= trabalhadores.find(checar =>checar.id===id)
    if(!olhaId){
        return response
        .status(400)
        .json({erro: 'Id inexistente!!!'})
    }
    return next()
}


const verificaDados = (request, response, next) => {
    const {nome, funcao, salario} = request.body
    if (!nome || !funcao || !salario){
        return response
            .status(400)
            .json({Erro: 'Por favor, vefique as informações pois alguma campo está em branco ou com informação faltando'})
    }
    return next()
} 




app.get('/funcionarios', (request, response) =>{
    return response
    .status(200)
    .json(trabalhadores)
})

app.post('/funcionarios',verificaDados, (request, response) =>{
    const {nome, funcao,salario}=request.body
    const colocartra = {
        id: uuid.v4(),
        nome,
        funcao,
        salario,      
    }
 
    trabalhadores = [...trabalhadores,colocartra]
    return response
    .status(200)
    .json(colocartra)
})

app.get('/funcionarios/:id',checaId, (request, response) =>{
    const {id} = request.params
    const listarid = trabalhadores.filter(busca =>busca.id ===id)
    return response
    .status(200)
    .json(listarid)
})

app.delete('/funcionarios/:id',checaId, (request, response) => {
    const {id} = request.params
    let apagartraba= trabalhadores.findIndex(procu => procu.id ===id)
    trabalhadores.splice(apagartraba, 1)
    return response
    .status(200)
    .json({Finalizado: 'Trabalhador deletado com sucesso!'})

})

app.put('/funcionarios/:id',checaId, verificaDados, (request, response)=>{
    const{nome, funcao,salario}=request.body
    const {id}= request.params
    let alterartra = trabalhadores.findIndex(tra => tra.id===id)
    const alterartrabalhadores ={
        id,
        nome,
        funcao,
        salario,     
    }
    trabalhadores.splice(alterartra, 1,alterartrabalhadores)
    return response
    .status(200)
    .json(alterartrabalhadores)
})

app.get('/funcionario/gastototal', (request, response)=> {
    const{salliq}=request.body
    const somavalor=trabalhadores.reduce((soma,valor) =>{
        return soma+valor.salliq
    }, 0)
    return response
    .status(200)
    .json({"gasto total":somavalor})
})

app.get('/funcionario/folhaindividual', (request, response)=>{
    const {nome}=request.query
    const voltanome= trabalhadores.filter(resp => resp.nome===nome)
    return response
    .status(200)
    .json(voltanome)
})

app.listen(3333, ()=> {
    console.log('servidor Rodando!!!')
})