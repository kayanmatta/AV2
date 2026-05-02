import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

export default function Relatorio() {
  const { usuarioLogado, logout } = useAuth()
  const { buscarAeronave, gerarRelatorio } = useApp()
  const { codigo } = useParams<{ codigo: string }>()
  const [cliente, setCliente] = useState('')
  const [relatorio, setRelatorio] = useState('')
  const [erro, setErro] = useState('')

  const aeronave = buscarAeronave(codigo || '')

  if (!aeronave) {
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
          <h2>Aeronave não encontrada</h2>
          <Link to="/aeronaves">Voltar</Link>
        </main>
      </div>
    )
  }

  function handleGerar() {
    setErro('')
    if (!cliente.trim()) {
      setErro('Informe o nome do cliente.')
      return
    }
    const texto = gerarRelatorio(codigo!, cliente.trim())
    setRelatorio(texto)
  }

  function handleBaixar() {
    const blob = new Blob([relatorio], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio_${codigo}.txt`
    a.click()
    URL.revokeObjectURL(url)
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
          <h2>Relatório de Entrega — {aeronave.codigo}</h2>
          <Link to={`/aeronaves/${codigo}`} className="btn-acao btn-secundario">Voltar</Link>
        </div>

        {!relatorio ? (
          <div className="form-cadastro">
            <div className="campo">
              <label htmlFor="cliente">Nome do Cliente</label>
              <input
                id="cliente"
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                placeholder="Ex: Emirates Airline"
                autoFocus
              />
            </div>
            {erro && <p className="msg-erro">{erro}</p>}
            <button className="btn-acao" onClick={handleGerar}>
              Gerar Relatório
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <button className="btn-acao" onClick={handleBaixar}>
                📥 Baixar .txt
              </button>
              <button className="btn-acao btn-secundario" onClick={() => { setRelatorio(''); setCliente(''); }}>
                Novo Relatório
              </button>
            </div>
            <pre className="relatorio-texto">{relatorio}</pre>
          </div>
        )}
      </main>
    </div>
  )
}