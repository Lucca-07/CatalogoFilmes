import express from "express";
const app = express();
app.use(express.json());
app.use(cors());
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import connectDB from "./modules/connect.js";
import Filme from "./model/Filme.js";
import Usuario from "./model/Usuario.js";
import encrypt from "./modules/encrypt.js";

//Obtem a lista de filmes
//Requisição GET no endereço http://localhost:3000/filmes
app.get("/filmes", async (req, res) => {
    try {
        const filmes = await Filme.find();
        if (!filmes) {
            res.status(422).json({
                msg: "Nenhum filme encontrado!",
            });
        }
        res.status(200).json(filmes);
    } catch (error) {
        console.log("Erro na aplicação: " + error);
        res.status(500).json({
            msg: "Erro na aplicação!",
        });
    }
});
//Cadastro de filmes
//POST em http://localhost:3000/filmes
app.post("/filmes", async (req, res) => {
    const { titulo, sinopse } = req.body;

    const filme = new Filme({
        titulo: titulo,
        sinopse: sinopse,
    });
    await filme.save();
    const filmes = await Filme.find();
    res.status(200).json(filmes);
});

//Cadastro de usuário
//POST em http://localhost:3000/signup
app.post("/signup", async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login) {
            return res.status(400).json({ msg: "O login é obrigatório" });
        }
        if (!password) {
            return res.status(400).json({ msg: "A senha é obrigatório" });
        }
        const passHash = await encrypt(password);
        const usuario = new Usuario({
            login,
            password: passHash,
        });

        const respMongo = await usuario.save();

        console.log(respMongo);
        res.status(201).json({ msg: "Usuário criado com sucesso!" }).end();
    } catch (error) {
        console.log("Erro ao cadastrar usuário: " + error);
        res.status(409).json({ msg: "Erro ao cadastrar usuário" }).end();
    }
});

app.post("/login", async (req, res) => {
    const { login, password } = req.body;
    if (!login) {
        return res.status(400).json({ msg: "Login faltando!" });
    }
    if (!password) {
        return res.status(400).json({ msg: "Senha faltando!" });
    }

    try {
        const user = await Usuario.findOne({ login });
        if (!user) {
            return res.status(401).json({ msg: "Usuário inválido!" });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ msg: "Senha incorreta!" });
        }

        const token = jwt.sign({ login: login }, "chave-secreta", {
            expiresIn: "1h",
        });

        res.status(200).json({
            msg: "Login realizado",
            token: token,
        });
    } catch (error) {
        console.log("Erro na aplicação: " + error);
        return res.status(500).json({ msg: "Erro na aplicação de login" });
    }
});

//FAZ O SERVER RODAR
app.listen(3000, () => {
    connectDB();
    console.log("🔥 Servidor rodando na porta 3000");
});
