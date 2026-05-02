import { useState, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { TipoTeste, ResultadoTeste } from '../types'

export default function FormTeste() {
  const { usuarioLogado, logout } = useAuth()
  const { adicionarTeste } = useApp()
  const navigate = useNavigate()
  const { codigo } = useParams<{ codigo: string }>()

  const [tipo, setTipo] = useState<TipoTeste>(TipoTeste.ELETRICO)
  const [resultado, setResultado] = useState<ResultadoTeste>(ResultadoTeste.APROVADO)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (codigo) {
      adicionarTeste(codigo, tipo, resultado)
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
          <h2>Executar Teste — {codigo}</h2>
          <Link to={`/aeronaves/${codigo}`} className="btn-acao btn-secundario">Voltar</Link>
        </div>

        <form onSubmit={handleSubmit} className="form-cadastro">
          <div className="campo">
            <label htmlFor="tipo">Tipo de teste</label>
            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoTeste)}>
              <option value={TipoTeste.ELETRICO}>Elétrico</option>
              <option value={TipoTeste.HIDRAULICO}>Hidráulico</option>
              <option value={TipoTeste.AERODINAMICO}>Aerodinâmico</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="resultado">Resultado</label>
            <select id="resultado" value={resultado} onChange={(e) => setResultado(e.target.value as ResultadoTeste)}>
              <option value={ResultadoTeste.APROVADO}>Aprovado</option>
              <option value={ResultadoTeste.REPROVADO}>Reprovado</option>
            </select>
          </div>

          <button type="submit" className="btn-acao">Registrar Teste</button>
        </form>
      </main>
    </div>
  )
}