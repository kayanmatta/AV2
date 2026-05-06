import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { StatusPeca, NivelPermissao } from '../types'

export default function GerenciarEtapas() {
  const { usuarioLogado, logout, temPermissao } = useAuth()
  const { buscarAeronave, iniciarEtapa, finalizarEtapa, excluirEtapa, atualizarStatusPeca } = useApp()
  const { codigo } = useParams<{ codigo: string }>()
  const navigate = useNavigate()

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

  function handleIniciar(etapaId: string) {
    const ok = iniciarEtapa(codigo!, etapaId)
    if (!ok) {
      alert('Não foi possível iniciar esta etapa. Verifique se a etapa anterior foi concluída.')
      return
    }
    navigate(`/aeronaves/${codigo}`)
  }

  function handleFinalizar(etapaId: string) {
    const etapa = aeronave?.etapas.find((e) => e.id === etapaId)
    if (etapa && etapa.funcionarios.length === 0) {
      alert('Esta etapa não possui funcionários vinculados. Associe um funcionário antes de finalizar.')
      return
    }
    const ok = finalizarEtapa(codigo!, etapaId)
    if (!ok) {
      alert('Não foi possível finalizar esta etapa.')
      return
    }
    navigate(`/aeronaves/${codigo}`)
  }

  function handleExcluirEtapa(etapaId: string) {
    if (window.confirm('Excluir esta etapa?')) {
      excluirEtapa(codigo!, etapaId)
      navigate(`/aeronaves/${codigo}`)
    }
  }

  function handleAtualizarPeca(pecaId: string, novoStatus: StatusPeca) {
    atualizarStatusPeca(codigo!, pecaId, novoStatus)
    navigate(`/aeronaves/${codigo}`)
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
          <h2>Gerenciar — {aeronave.codigo}</h2>
          <Link to={`/aeronaves/${codigo}`} className="btn-acao btn-secundario">Voltar</Link>
        </div>

        <section className="secao">
          <h3>Peças</h3>
          {aeronave.pecas.length === 0 ? (
            <p className="texto-vazio">Nenhuma peça.</p>
          ) : (
            <ul className="lista-simples">
              {aeronave.pecas.map((p) => (
                <li key={p.id}>
                  <strong>{p.nome}</strong> — {p.fornecedor}
                  <span className={`badge badge-${p.status === 'PRONTA' ? 'verde' : p.status === 'EM_TRANSPORTE' ? 'laranja' : 'azul'}`}>
                    {p.status === 'EM_PRODUCAO' ? 'Em Produção' : p.status === 'EM_TRANSPORTE' ? 'Em Transporte' : 'Pronta'}
                  </span>
                  {temPermissao(NivelPermissao.ENGENHEIRO) && (
                    <select
                      value={p.status}
                      onChange={(e) => handleAtualizarPeca(p.id, e.target.value as StatusPeca)}
                      className="select-inline"
                    >
                      <option value={StatusPeca.EM_PRODUCAO}>Em Produção</option>
                      <option value={StatusPeca.EM_TRANSPORTE}>Em Transporte</option>
                      <option value={StatusPeca.PRONTA}>Pronta</option>
                    </select>
                  )}
                </li>
              ))}
            </ul>
          )}
          {temPermissao(NivelPermissao.ENGENHEIRO) && (
          <Link to={`/aeronaves/${codigo}/pecas/novo`} className="btn-acao" style={{ marginTop: '0.75rem' }}>
            + Adicionar Peça
          </Link>
          )}
        </section>

        <section className="secao">
          <h3>Etapas</h3>
          {aeronave.etapas.length === 0 ? (
            <p className="texto-vazio">Nenhuma etapa.</p>
          ) : (
            <ul className="lista-simples">
              {aeronave.etapas.map((e) => (
                <li key={e.id}>
                  <strong>{e.ordem}. {e.nome}</strong>
                  <span className={`badge badge-${e.status === 'CONCLUIDA' ? 'verde' : e.status === 'EM_ANDAMENTO' ? 'laranja' : 'azul'}`}>
                    {e.status === 'PENDENTE' ? 'Pendente' : e.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Concluída'}
                  </span>
                  <span className="detalhe-extra">{e.funcionarios.length} func.</span>
                  <div className="acoes-inline">
                    {temPermissao(NivelPermissao.ENGENHEIRO) && e.status === 'PENDENTE' && (
                      <button className="link-acao" onClick={() => handleIniciar(e.id)}>Iniciar</button>
                    )}
                    {temPermissao(NivelPermissao.ENGENHEIRO) && e.status === 'EM_ANDAMENTO' && (
                      <button className="link-acao" onClick={() => handleFinalizar(e.id)}>Finalizar</button>
                    )}
                    {temPermissao(NivelPermissao.ENGENHEIRO) && (
                      <>
                        <Link to={`/aeronaves/${codigo}/etapas/${e.id}/funcionarios`} className="link-acao">
                          Funcionários
                        </Link>
                        <button className="link-acao link-perigo" onClick={() => handleExcluirEtapa(e.id)}>
                          Excluir
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {temPermissao(NivelPermissao.ENGENHEIRO) && (
          <Link to={`/aeronaves/${codigo}/etapas/novo`} className="btn-acao" style={{ marginTop: '0.75rem' }}>
            + Adicionar Etapa
          </Link>
          )}
        </section>
      </main>
    </div>
  )
}