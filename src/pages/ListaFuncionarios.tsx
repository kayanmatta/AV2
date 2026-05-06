import { useState, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { NivelPermissao } from '../types'

export default function ListaFuncionarios() {
  const { usuarioLogado, logout, funcionarios, cadastrarFuncionario, excluirFuncionario } = useAuth()
  const [mostrarForm, setMostrarForm] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [nivel, setNivel] = useState<NivelPermissao>(NivelPermissao.OPERADOR)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro('')
    setSucesso('')

    if (!nome.trim() || !usuario.trim() || !senha.trim()) {
      setErro('Nome, usuário e senha são obrigatórios.')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setCarregando(true)
    const id = await cadastrarFuncionario(nome.trim(), telefone.trim(), endereco.trim(), usuario.trim(), senha, nivel)
    setCarregando(false)

    if (!id) {
      setErro('Não foi possível cadastrar. Verifique os dados informados.')
      return
    }

    setSucesso(`Funcionário ${nome.trim()} cadastrado!`)
    setNome('')
    setTelefone('')
    setEndereco('')
    setUsuario('')
    setSenha('')
    setNivel(NivelPermissao.OPERADOR)
    setMostrarForm(false)
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
          <h2>Funcionários</h2>
          <button className="btn-acao" onClick={() => setMostrarForm(!mostrarForm)}>
            {mostrarForm ? 'Cancelar' : '+ Novo Funcionário'}
          </button>
        </div>

        {sucesso && <p className="msg-sucesso">{sucesso}</p>}

        {mostrarForm && (
          <form onSubmit={handleSubmit} className="form-cadastro" style={{ marginBottom: '2rem' }}>
            <div className="campo">
              <label htmlFor="nome">Nome completo *</label>
              <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" autoFocus />
            </div>
            <div className="campo">
              <label htmlFor="telefone">Telefone</label>
              <input id="telefone" type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div className="campo">
              <label htmlFor="endereco">Endereço</label>
              <input id="endereco" type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, Nº - Bairro" />
            </div>
            <div className="campo">
              <label htmlFor="usuario">Nome de usuário *</label>
              <input id="usuario" type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="Nome de usuario" />
            </div>
            <div className="campo">
              <label htmlFor="senha">Senha *</label>
              <input id="senha" type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Mínimo 6 caracteres" />
            </div>
            <div className="campo">
              <label htmlFor="nivel">Nível de permissão</label>
              <select id="nivel" value={nivel} onChange={(e) => setNivel(e.target.value as NivelPermissao)}>
                <option value={NivelPermissao.ADMINISTRADOR}>Administrador</option>
                <option value={NivelPermissao.ENGENHEIRO}>Engenheiro</option>
                <option value={NivelPermissao.OPERADOR}>Operador</option>
              </select>
            </div>
            {erro && <p className="msg-erro">{erro}</p>}
            <button type="submit" className="btn-acao" disabled={carregando}>
              {carregando ? 'Cadastrando...' : 'Cadastrar Funcionário'}
            </button>
          </form>
        )}

        {funcionarios.length === 0 ? (
          <div className="vazio">
            <p>Nenhum funcionário cadastrado.</p>
          </div>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Usuário</th>
                <th>Telefone</th>
                <th>Nível</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {funcionarios.map((f) => (
                <tr key={f.id}>
                  <td><strong>{f.nome}</strong></td>
                  <td>{f.usuario}</td>
                  <td>{f.telefone || '—'}</td>
                  <td>
                    <span className={`badge badge-${f.nivelPermissao === 'ADMINISTRADOR' ? 'vermelho' : f.nivelPermissao === 'ENGENHEIRO' ? 'laranja' : 'azul'}`}>
                      {f.nivelPermissao === 'ADMINISTRADOR' ? 'Admin' : f.nivelPermissao === 'ENGENHEIRO' ? 'Engenheiro' : 'Operador'}
                    </span>
                  </td>
                  <td>
                    {f.id !== usuarioLogado?.id && (
                      <button
                        className="link-acao link-perigo"
                        onClick={() => {
                          if (window.confirm(`Excluir funcionário ${f.nome}?`)) {
                            const ok = excluirFuncionario(f.id)
                            if (!ok) {
                              alert('Não é possível excluir este funcionário. Verifique se ele não é o último administrador do sistema.')
                            }
                          }
                        }}
                      >
                        Excluir
                      </button>
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