import { useState, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { TipoPeca, StatusPeca } from '../types'

export default function FormPeca() {
  const { usuarioLogado, logout } = useAuth()
  const { adicionarPeca } = useApp()
  const navigate = useNavigate()
  const { codigo } = useParams<{ codigo: string }>()

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<TipoPeca>(TipoPeca.NACIONAL)
  const [fornecedor, setFornecedor] = useState('')
  const [status, setStatus] = useState<StatusPeca>(StatusPeca.EM_PRODUCAO)
  const [erro, setErro] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')

    if (!nome.trim() || !fornecedor.trim()) {
      setErro('Preencha nome e fornecedor.')
      return
    }

    if (codigo) {
      adicionarPeca(codigo, nome.trim(), tipo, fornecedor.trim(), status)
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
          <h2>Adicionar Peça — {codigo}</h2>
          <Link to={`/aeronaves/${codigo}`} className="btn-acao btn-secundario">Voltar</Link>
        </div>

        <form onSubmit={handleSubmit} className="form-cadastro">
          <div className="campo">
            <label htmlFor="nome">Nome da peça</label>
            <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Turbina Rolls-Royce" autoFocus />
          </div>

          <div className="campo">
            <label htmlFor="tipo">Tipo</label>
            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoPeca)}>
              <option value={TipoPeca.NACIONAL}>Nacional</option>
              <option value={TipoPeca.IMPORTADA}>Importada</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="fornecedor">Fornecedor</label>
            <input id="fornecedor" type="text" value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} placeholder="Ex: GE Aviation" />
          </div>

          <div className="campo">
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as StatusPeca)}>
              <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
              <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
              <option value={StatusPeca.PRONTA}>Pronta</option>
            </select>
          </div>

          {erro && <p className="msg-erro">{erro}</p>}

          <button type="submit" className="btn-acao">Adicionar Peça</button>
        </form>
      </main>
    </div>
  )
}