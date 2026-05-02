import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { NivelPermissao } from '../types'

export default function ListaAeronaves() {
  const { usuarioLogado, logout, temPermissao } = useAuth()
  const { aeronaves, excluirAeronave } = useApp()

  const podeGerenciar = temPermissao(NivelPermissao.ADMINISTRADOR)

  function handleExcluir(codigo: string, modelo: string) {
    if (window.confirm(`Excluir aeronave ${codigo} - ${modelo}?`)) {
      excluirAeronave(codigo)
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
          <h2>Aeronaves</h2>
          {podeGerenciar && (
            <Link to="/aeronaves/novo" className="btn-acao">+ Nova Aeronave</Link>
          )}
        </div>

        {aeronaves.length === 0 ? (
          <div className="vazio">
            <p>Nenhuma aeronave cadastrada.</p>
            {podeGerenciar && (
              <Link to="/aeronaves/novo">Cadastrar primeira aeronave</Link>
            )}
          </div>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Código</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Capacidade</th>
                <th>Alcance</th>
                <th>Etapas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {aeronaves.map((a) => (
                <tr key={a.codigo}>
                  <td><strong>{a.codigo}</strong></td>
                  <td>{a.modelo}</td>
                  <td>{a.tipo === 'COMERCIAL' ? 'Comercial' : 'Militar'}</td>
                  <td>{a.capacidade} pax</td>
                  <td>{a.alcance} km</td>
                  <td>
                    {a.etapas.filter((e) => e.status === 'CONCLUIDA').length}/{a.etapas.length}
                  </td>
                  <td className="acoes-celula">
                    <Link to={`/aeronaves/${a.codigo}`} className="link-acao">Detalhes</Link>
                    {podeGerenciar && (
                      <>
                        <Link to={`/aeronaves/${a.codigo}/editar`} className="link-acao">Editar</Link>
                        <button
                          className="link-acao link-perigo"
                          onClick={() => handleExcluir(a.codigo, a.modelo)}
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  )
}