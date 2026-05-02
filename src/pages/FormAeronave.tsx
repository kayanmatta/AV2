import { useState, FormEvent, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../context/AppContext'
import { TipoAeronave } from '../types'

export default function FormAeronave() {
  const { usuarioLogado, logout } = useAuth()
  const { cadastrarAeronave, editarAeronave, buscarAeronave } = useApp()
  const navigate = useNavigate()
  const { codigo } = useParams<{ codigo: string }>()

  const editando = Boolean(codigo)
  const aeronave = editando ? buscarAeronave(codigo!) : undefined

  const [modelo, setModelo] = useState('')
  const [tipo, setTipo] = useState<TipoAeronave>(TipoAeronave.COMERCIAL)
  const [capacidade, setCapacidade] = useState('')
  const [alcance, setAlcance] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (aeronave) {
      setModelo(aeronave.modelo)
      setTipo(aeronave.tipo)
      setCapacidade(String(aeronave.capacidade))
      setAlcance(String(aeronave.alcance))
    }
  }, [aeronave])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')

    if (!modelo.trim() || !capacidade || !alcance) {
      setErro('Preencha todos os campos.')
      return
    }

    const numCapacidade = parseInt(capacidade)
    const numAlcance = parseInt(alcance)

    if (isNaN(numCapacidade) || numCapacidade <= 0) {
      setErro('Capacidade deve ser um número positivo.')
      return
    }

    if (isNaN(numAlcance) || numAlcance <= 0) {
      setErro('Alcance deve ser um número positivo.')
      return
    }

    if (editando && codigo) {
      editarAeronave(codigo, modelo.trim(), tipo, numCapacidade, numAlcance)
      navigate(`/aeronaves/${codigo}`)
    } else {
      const novoCodigo = cadastrarAeronave(modelo.trim(), tipo, numCapacidade, numAlcance)
      navigate(`/aeronaves/${novoCodigo}`)
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
          <h2>{editando ? `Editar Aeronave ${codigo}` : 'Nova Aeronave'}</h2>
          <Link to="/aeronaves" className="btn-acao btn-secundario">Voltar</Link>
        </div>

        <form onSubmit={handleSubmit} className="form-cadastro">
          <div className="campo">
            <label htmlFor="modelo">Modelo</label>
            <input
              id="modelo"
              type="text"
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              autoFocus
            />
          </div>

          <div className="campo">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoAeronave)}
            >
              <option value={TipoAeronave.COMERCIAL}>Comercial</option>
              <option value={TipoAeronave.MILITAR}>Militar</option>
            </select>
          </div>

          <div className="campo">
            <label htmlFor="capacidade">Capacidade (passageiros)</label>
            <input
              id="capacidade"
              type="number"
              min="1"
              value={capacidade}
              onChange={(e) => setCapacidade(e.target.value)}
            />
          </div>

          <div className="campo">
            <label htmlFor="alcance">Alcance (km)</label>
            <input
              id="alcance"
              type="number"
              min="1"
              value={alcance}
              onChange={(e) => setAlcance(e.target.value)}
            />
          </div>

          {erro && <p className="msg-erro">{erro}</p>}

          <button type="submit" className="btn-acao">
            {editando ? 'Salvar Alterações' : 'Cadastrar Aeronave'}
          </button>
        </form>
      </main>
    </div>
  )
}