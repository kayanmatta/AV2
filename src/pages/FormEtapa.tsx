import { useState, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

export default function FormEtapa() {
  const { usuarioLogado, logout } = useAuth()
  const { adicionarEtapa } = useApp()
  const navigate = useNavigate()
  const { codigo } = useParams<{ codigo: string }>()

  const [nome, setNome] = useState('')
  const [prazo, setPrazo] = useState('')
  const [erro, setErro] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')

    if (!nome.trim() || !prazo.trim()) {
      setErro('Preencha nome e prazo.')
      return
    }

    if (codigo) {
      adicionarEtapa(codigo, nome.trim(), prazo.trim())
      navigate(`/aeronaves/${codigo}`)
    }
  }

  return (
    <div className="dashboard">
      <header className="topo">
        <div>
          <Link to="/dashboard" className="logo-link">AEROCODE</Link>
          <Link to="/aeronaves" className="nav-link">Aeronaves</Link>
        </div>
        <div>
          <span className="user-info">
            {usuarioLogado?.nome} ({usuarioLogado?.nivelPermissao})
          </span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="conteudo">
        <div className="cabecalho-pagina">
          <h2>Adicionar Etapa — {codigo}</h2>
          <Link to={`/aeronaves/${codigo}`} className="btn-acao btn-secundario">Voltar</Link>
        </div>

        <form onSubmit={handleSubmit} className="form-cadastro">
          <div className="campo">
            <label htmlFor="nome">Nome da etapa</label>
            <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} autoFocus />
          </div>

          <div className="campo">
            <label htmlFor="prazo">Prazo (dd/mm/aaaa)</label>
            <input id="prazo" type="text" value={prazo} onChange={(e) => setPrazo(e.target.value)} placeholder="15/06/2026" />
          </div>

          {erro && <p className="msg-erro">{erro}</p>}

          <button type="submit" className="btn-acao">Adicionar Etapa</button>
        </form>
      </main>
    </div>
  )
}