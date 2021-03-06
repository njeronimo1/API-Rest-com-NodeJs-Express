
const express = require('express');
const { randomUUID } = require("crypto");
const fs = require('fs');

const app = express();

var cors = require('cors')

app.use(cors()) // Use this after the variable declaration

const port = process.env.PORT || 4002;

app.use(express.json());

let usuarios = [];

fs.readFile("usuarios.json", "UTF-8", (err, data) => {
    if(err){
        console.log(err);
    }else{
        usuarios = JSON.parse(data);
    };
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* Insert de um usuario */

app.post('/cadastro', (req, res) => {
    // Nome, Endereço, Idade
    const { nome, endereco, idade } = req.body;
    const usuariosReq = {
        nome,
        endereco,
        idade,
        id: randomUUID()
    };

    usuarios.push(usuariosReq);

    userFilesDB();

    return res.json(usuarios);
});

app.get('/usuarios', (req, res) => {
    return res.json(
        usuarios
    );
});

app.get('/usuarios/:id_root', (req, res) => {
    const { id_root } = req.params
    const usuarioFiltro = usuarios.find(user => user.id === id_root);
    return res.json(usuarioFiltro);
});

app.put('/usuarios/:id_root', (req, res) => {
    const { id_root } = req.params;
    const { nome, endereco,idade} = req.body;
    const usuarioIndex = usuarios.findIndex(user => user.id === id_root);
    usuarios[usuarioIndex] = {
        ...usuarios[usuarioIndex],
        nome,
        endereco,
        idade
    };

    userFilesDB();

    return res.json({message:'Produto alterado com sucesso'});

});

app.delete('/usuarios/:id_root', (req, res) => {
    const { id_root } = req.params;
    const usuarioIndex = usuarios.findIndex(user => user.id === id_root);
    usuarios.splice(usuarioIndex, 1);

    userFilesDB();

    return res.json({message:'Usuario deletado com sucesso'});
    
});

app.get('/', (req, res) => {
    res.send("Use as rotas: /usuarios, /usuarios/id_do_usuario");
});

function userFilesDB(){
    fs.writeFile("usuarios.json", JSON.stringify(usuarios), (err) =>{
        if(err){
            console.log(err);
        }else{
            console.log("Usuario inserido sucesso");
        }
    });
}

app.listen(port, () => console.log("Ta rodando na 4002"));
