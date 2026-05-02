import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

export default function AssociarFuncionarios() {
  const { usuarioLogado, logout, funcionarios } = useAuth()
  const { buscarAeronave, associarFuncionarioEtapa } = useApp()
  const { codigo, etapaId } = useParams<{ codigo: string; etapaId: string }>()
  const navigate = useNavigate()
  const [mensagem, setMensagem] = useState('')

  const aeronave = buscarAeronave(codigo || '')
  const etapa = aeronave?.etapas.find((e) => e.id === etapaId)

  if (!aeronave || !etapa) {
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
          <h2>Etapa não encontrada</h2>
          <Link to="/aeronaves">Voltar</Link>
        </main>
      </div>
    )
  }

  function handleVincular(funcionarioId: string) {
    if (etapa!.funcionarios.includes(funcionarioId)) {
      setMensagem('Funcionário já vinculado.')
      setTimeout(() => setMensagem(''), 2000)
      return
    }
    associarFuncionarioEtapa(codigo!, etapaId!, funcionarioId)
    navigate(`/aeronaves/${codigo}/gerenciar`)
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
          <h2>Associar Funcionários — {etapa.nome}</h2>
          <Link to={`/aeronaves/${codigo}/gerenciar`} className="btn-acao btn-secundario">Voltar</Link>
        </div>

        <p className="sub-info">Etapa: {etapa.ordem}. {etapa.nome} | Aeronave: {codigo}</p>

        {mensagem && <p className="msg-erro">{mensagem}</p>}

        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Vinculados ({etapa.funcionarios.length})</h4>
        {etapa.funcionarios.length === 0 ? (
          <p className="texto-vazio">Nenhum funcionário vinculado.</p>
        ) : (
          <ul className="lista-simples">
            {etapa.funcionarios.map((fid) => {
              const func = funcionarios.find((f) => f.id === fid)
              return (
                <li key={fid}>
                  {func ? `${func.nome} (${func.nivelPermissao})` : fid}
                </li>
              )
            })}
          </ul>
        )}

        <h4 style={{ marginTop: '1.5rem', marginBottom: '0.75rem' }}>Funcionários Disponíveis</h4>
        {funcionarios.length === 0 ? (
          <p className="texto-vazio">Nenhum funcionário cadastrado.</p>
        ) : (
          <ul className="lista-simples">
            {funcionarios
              .filter((f) => !etapa.funcionarios.includes(f.id))
              .map((f) => (
                <li key={f.id}>
                  <strong>{f.nome}</strong> ({f.nivelPermissao}) — {f.usuario}
                  <button
                    className="link-acao"
                    onClick={() => handleVincular(f.id)}
                    style={{ marginLeft: 'auto' }}
                  >
                    Vincular
                  </button>
                </li>
              ))}
          </ul>
        )}
      </main>
    </div>
  )
}