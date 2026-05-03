import { useState,useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, precisaConfiguracaoInicial, estaLogado } = useAuth()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [verificando, setVerificando] = useState(true)

  useEffect(() => {
    if (precisaConfiguracaoInicial()) {
      navigate('/configuracao-inicial', { replace: true })
      return
    }
    if (estaLogado()) {
      navigate('/dashboard', { replace: true })
      return
    }
    setVerificando(false)
  }, [precisaConfiguracaoInicial, estaLogado, navigate])

  if (verificando) {
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')

    if (!usuario.trim() || !senha.trim()) {
      setErro('Preencha todos os campos.')
      return
    }

    setCarregando(true)
    const ok = await login(usuario.trim(), senha)
    setCarregando(false)

    if (ok) {
      navigate('/dashboard', { replace: true })
    } else {
      setErro('Usuário ou senha inválidos.')
    }
  }

  return (
    <div className="pagina-login">
      <div className="card-login">
        <h1>AEROCODE</h1>
        <p>Sistema de Gestão de Produção de Aeronaves</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="usuario">Usuário</label>
          <input
            id="usuario"
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Seu nome de usuario"
            autoComplete="username"
            autoFocus
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
            autoComplete="current-password"
          />

          {erro && <p className="msg-erro">{erro}</p>}

          <button type="submit" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}