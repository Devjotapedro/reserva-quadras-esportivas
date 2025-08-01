const usuario = require('../model/usuario.model');
const bcrypt = require('bcryptjs');

class UsuarioController {
    static async cadastrarUsuario(req, res) {
        try {
            const { nome, email, senha } = req.body;
            if(!nome || !email || !senha){
                return res
                .status(400)
                .json({ msg: "Todos os campos devem ser preenchidos!" });
            }

            // criptografia
            const senhaCriptografada = await bcrypt.hash(senha, 12);

            const novoUsuario = await usuario.create({
                nome,
                email,
                senha: senhaCriptografada
            });

            res.status(201).json(novoUsuario);
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({ error: 'Erro ao cadastrar usuário' });
        }
    }

    static async listarUsuarios(req, res) {
        try {
            const usuarios = await usuario.findAll({
                attributes: ['nome', 'email'], // apenas os campos públicos
            });
            if(usuarios.length === 0){
                return res.status(200).json({ msg: "Não há usuários cadastrados", data: []});
            }
            return res.status(200).json(usuarios);
            
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({ error: 'Erro ao listar usuários' });
        }
    }

    static async buscarUsuarioPorId(req, res) {
        try {
            const { id } = req.params;
            const usuarioEncontrado = await usuario.findByPk(id, {
                attributes: {exclude: ['senha']}
            });
            if (!usuarioEncontrado) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            res.status(200).json(usuarioEncontrado);
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            res.status(500).json({ error: 'Erro ao buscar usuário por ID' });
        }
    }

    static async atualizarUsuario(req, res) {
        try {
            const { id } = req.params;
            const { nome, email, senha } = req.body;

            if(!id || !nome || !email || !senha){
                return res
                .status(400)
                .json({ msg: "Todos os campos devem ser preenchidos!" });
            }

            // criptografia
            const senhaCriptografada = await bcrypt.hash(senha, 12);

            const usuarioAtualizado = await usuario.update(
                { nome, email, senha: senhaCriptografada },
                { where: { id } }
            );

            if (usuarioAtualizado[0] === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.status(200).json({ message: 'Usuário atualizado com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({ error: 'Erro ao atualizar usuário' });
        }
    }

    static async excluirUsuario(req, res) {
        try {
            const { id } = req.params;

            const usuarioExcluido = await usuario.destroy({ where: { id } });

            if (usuarioExcluido === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            res.status(200).json({ message: 'Usuário excluído com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir usuário:', error);
            res.status(500).json({ error: 'Erro ao excluir usuário' });
        }
    }
}

module.exports = UsuarioController;