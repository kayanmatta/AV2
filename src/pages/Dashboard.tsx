import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { NivelPermissao } from '../types'

export default function Dashboard() {
  const { usuarioLogado, logout, temPermissao } = useAuth()
  const { aeronaves } = useApp()

  const etapasConcluidas = aeronaves.reduce(
    (total, a) => total + a.etapas.filter((e) => e.status === 'CONCLUIDA').length,
    0
  )
  const etapasEmAndamento = aeronaves.reduce(
    (total, a) => total + a.etapas.filter((e) => e.status === 'EM_ANDAMENTO').length,
    0
  )
  const testesRealizados = aeronaves.reduce((total, a) => total + a.testes.length, 0)

  return (
    <div className="dashboard">
      <header className="topo">
        <div>
          <Link to="/dashboard" className="logo-link">AEROCODE</Link>
          <Link to="/aeronaves" className="nav-link">Aeronaves</Link>
          {temPermissao(NivelPermissao.ADMINISTRADOR) && (
            <Link to="/funcionarios" className="nav-link">Funcionários</Link>
          )}
        </div>
        <div>
          <span className="user-info">
            {usuarioLogado?.nome} ({usuarioLogado?.nivelPermissao})
          </span>
          <button onClick={logout}>Sair</button>
        </div>
      </header>

      <main className="conteudo">
        <h2>Dashboard</h2>

        <div className="cards-resumo">
          <div className="card-resumo">
            <span className="card-numero">{aeronaves.length}</span>
            <span className="card-label">Aeronaves</span>
          </div>
          <div className="card-resumo">
            <span className="card-numero">{etapasEmAndamento}</span>
            <span className="card-label">Etapas em Andamento</span>
          </div>
          <div className="card-resumo">
            <span className="card-numero">{etapasConcluidas}</span>
            <span className="card-label">Etapas Concluídas</span>
          </div>
          <div className="card-resumo">
            <span className="card-numero">{testesRealizados}</span>
            <span className="card-label">Testes Realizados</span>
          </div>
        </div>

        <div className="acoes-rapidas">
          <h3>Ações Rápidas</h3>
          {temPermissao(NivelPermissao.ADMINISTRADOR) && (
            <Link to="/aeronaves/novo" className="btn-acao">+ Nova Aeronave</Link>
          )}
          <Link to="/aeronaves" className="btn-acao btn-secundario">Ver Todas Aeronaves</Link>
        </div>
      </main>
    </div>
  )
}