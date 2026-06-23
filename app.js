import express from "express";
import path from "path";
import nodemailer from 'nodemailer';

import userRoutes from "./routes/userRoutes.js";
import pageRoutes from "./routes/pageRoutes.js"

import pontuacaoRoutes from "./routes/pontuacaoRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import moduloRoutes from "./routes/moduloRoutes.js";

import { pool } from "./config/database.js";


const app = express();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import dotenv from 'dotenv';
dotenv.config();


// Arquivos estáticos
  // app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(process.cwd(), "views")));
app.use("/css", express.static(path.join(process.cwd(), "css")));
app.use("/imgs", express.static(path.join(process.cwd(), "public/imgs")));
app.use("/js", express.static(path.join(process.cwd(), "public/js")));

// // Rotas

app.use("/api/users", userRoutes);
 app.use("/", pageRoutes);

 app.use("/api/quiz", quizRoutes);
app.use("/api/pontuacao", pontuacaoRoutes);
app.use("/api/ranking", rankingRoutes);
app.use("/modulo", moduloRoutes);

// porta

const PORT = process.env.PORT || 3000;



// Conexão banco
pool.getConnection()
  .then(() => {
    console.log("Conectado ao MySQL!");

    app.use((req, res, next) => {

  console.log(
    req.method,
    req.url
  );

  next();
    });

    
//************************************RECUPERAR SENHA****************************************************/

// Configuração do transporte de email
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, 
    auth: {
       user:  process.env.EMAIL_USER,
       pass:  process.env.SENHA_APP // cuidado: senha de app, não senha normal

        
    },
    tls: {
        rejectUnauthorized: false 
    }
});

// Função para gerar senha aleatória alfanumérica
function generateRandomPassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

// Endpoint para recuperação de senha
app.post('/recuperarSenha', async (req, res) => {
    const { email } = req.body;

    try {
        const senhaAleatoria = generateRandomPassword();

        // Atualizar a senha no banco
        const [result] = await pool.query(
            'UPDATE usuario SET senha = ? WHERE email = ?',
            [senhaAleatoria, email]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Email não encontrado' });
        }

        // Enviar email com a nova senha
        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Recuperação de Senha',
            text: `Você solicitou a recuperação de senha. Sua nova senha é: ${senhaAleatoria}`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Email de recuperação de senha enviado com sucesso!' });

    } catch (err) {
        console.error('Erro ao recuperar a senha:', err);
        res.status(500).json({ message: 'Erro no servidor. Tente novamente mais tarde.' });
    }
});



    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((erro) => {
    console.error("Erro ao conectar no banco:", erro);
  });



