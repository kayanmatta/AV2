import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'

export default function DetalhesAeronave() {
  const { usuarioLogado, logout } = useAuth()
  const { buscarAeronave } = useApp()
  const { codigo } = useParams<{ codigo: string }>()

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
          <Link to="/aeronaves">Voltar para lista</Link>
        </main>
      </div>
    )
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
          <h2>{aeronave.codigo} - {aeronave.modelo}</h2>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Link to={`/aeronaves/${codigo}/gerenciar`} className="btn-acao">Gerenciar</Link>
            <Link to={`/aeronaves/${codigo}/editar`} className="btn-acao">Editar</Link>
            <Link to="/aeronaves" className="btn-acao btn-secundario">Voltar</Link>
            <Link to={`/aeronaves/${codigo}/relatorio`} className="btn-acao">Relatório</Link>
          </div>
        </div>

        <div className="detalhes-grid">
          <div className="detalhe-item">
            <span className="detalhe-label">Tipo</span>
            <span className="detalhe-valor">{aeronave.tipo === 'COMERCIAL' ? 'Comercial' : 'Militar'}</span>
          </div>
          <div className="detalhe-item">
            <span className="detalhe-label">Capacidade</span>
            <span className="detalhe-valor">{aeronave.capacidade} passageiros</span>
          </div>
          <div className="detalhe-item">
            <span className="detalhe-label">Alcance</span>
            <span className="detalhe-valor">{aeronave.alcance} km</span>
          </div>
        </div>

        {/* PEÇAS */}
        <section className="secao">
          <h3>Peças ({aeronave.pecas.length})</h3>
          {aeronave.pecas.length === 0 ? (
            <p className="texto-vazio">Nenhuma peça registrada.</p>
          ) : (
            <ul className="lista-simples">
              {aeronave.pecas.map((p) => (
                <li key={p.id}>
                  {p.nome} — {p.fornecedor}
                  <span className={`badge badge-${p.status === 'PRONTA' ? 'verde' : p.status === 'EM_TRANSPORTE' ? 'laranja' : 'azul'}`}>
                    {p.status === 'EM_PRODUCAO' ? 'Em Produção' : p.status === 'EM_TRANSPORTE' ? 'Em Transporte' : 'Pronta'}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to={`/aeronaves/${codigo}/pecas/novo`} className="btn-acao" style={{ marginTop: '0.75rem' }}>
            + Adicionar Peça
          </Link>
        </section>

        {/* ETAPAS */}
        <section className="secao">
          <h3>Etapas ({aeronave.etapas.length})</h3>
          {aeronave.etapas.length === 0 ? (
            <p className="texto-vazio">Nenhuma etapa registrada.</p>
          ) : (
            <ul className="lista-simples">
              {aeronave.etapas.map((e) => (
                <li key={e.id}>
                  {e.ordem}. {e.nome} — Prazo: {e.prazo}
                  <span className={`badge badge-${e.status === 'CONCLUIDA' ? 'verde' : e.status === 'EM_ANDAMENTO' ? 'laranja' : 'azul'}`}>
                    {e.status === 'PENDENTE' ? 'Pendente' : e.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Concluída'}
                  </span>
                  <span className="detalhe-extra">{e.funcionarios.length} funcionário(s)</span>
                </li>
              ))}
            </ul>
          )}
          <Link to={`/aeronaves/${codigo}/etapas/novo`} className="btn-acao" style={{ marginTop: '0.75rem' }}>
            + Adicionar Etapa
          </Link>
        </section>

        {/* TESTES */}
        <section className="secao">
          <h3>Testes ({aeronave.testes.length})</h3>
          {aeronave.testes.length === 0 ? (
            <p className="texto-vazio">Nenhum teste registrado.</p>
          ) : (
            <ul className="lista-simples">
              {aeronave.testes.map((t) => (
                <li key={t.id}>
                  {t.tipo === 'ELETRICO' ? 'Elétrico' : t.tipo === 'HIDRAULICO' ? 'Hidráulico' : 'Aerodinâmico'}
                  <span className={`badge badge-${t.resultado === 'APROVADO' ? 'verde' : 'vermelho'}`}>
                    {t.resultado === 'APROVADO' ? 'Aprovado' : 'Reprovado'}
                  </span>
                  <span className="detalhe-extra">{t.data}</span>
                </li>
              ))}
            </ul>
          )}
          <Link to={`/aeronaves/${codigo}/testes/novo`} className="btn-acao" style={{ marginTop: '0.75rem' }}>
            + Executar Teste
          </Link>
        </section>
      </main>
    </div>
  )
}