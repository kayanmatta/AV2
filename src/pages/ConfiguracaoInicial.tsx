import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { NivelPermissao } from '../types'

export default function ConfiguracaoInicial() {
  const { cadastrarFuncionario, precisaConfiguracaoInicial, estaLogado } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    if (!precisaConfiguracaoInicial()) {
      if (estaLogado()) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    } else {
      setVerificando(false)
    }
  }, [precisaConfiguracaoInicial, estaLogado, navigate])

  if (verificando) {
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')

    if (!nome.trim() || !usuario.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não conferem.')
      return
    }

    setCarregando(true)
    const id = await cadastrarFuncionario(
      nome.trim(),
      '',
      '',
      usuario.trim(),
      senha,
      NivelPermissao.ADMINISTRADOR
    )
    setCarregando(false)

    if (!id) {
      setErro('Não foi possível cadastrar. Verifique os dados informados.')
      return
    }

    navigate('/login', { replace: true })
  }

  return (
    <div className="pagina-login">
      <div className="card-login">
        <h1>AEROCODE</h1>
        <p>Configuração Inicial — Cadastre o Administrador</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="nome">Nome completo</label>
          <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" autoFocus />

          <label htmlFor="usuario">Nome de usuário</label>
          <input id="usuario" type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="Nome de usuario" autoComplete="off" />

          <label htmlFor="senha">Senha</label>
          <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Minimo 6 caracteres" autoComplete="new-password" />

          <label htmlFor="confirmar">Confirmar senha</label>
          <input id="confirmar" type="password" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} placeholder="Repita a senha" autoComplete="new-password" />

          {erro && <p className="msg-erro">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Criando...' : 'Criar Administrador'}
          </button>
        </form>
      </div>
    </div>
  )
}