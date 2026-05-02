import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { type Funcionario, NivelPermissao } from '../types'
import { hashSenha, verificarSenha } from '../utils/auth'

interface AuthContextType {
  funcionarios: Omit<Funcionario, 'senha'>[]
  usuarioLogado: Omit<Funcionario, 'senha'> | null
  login: (usuario: string, senha: string) => Promise<boolean>
  logout: () => void
  cadastrarFuncionario: (
    nome: string,
    telefone: string,
    endereco: string,
    usuario: string,
    senha: string,
    nivelPermissao: NivelPermissao
  ) => Promise<string>
  temPermissao: (nivelNecessario: NivelPermissao) => boolean
  estaLogado: () => boolean
  getUsuarioLogado: () => Omit<Funcionario, 'senha'> | null
  precisaConfiguracaoInicial: () => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

function semSenha(f: Funcionario): Omit<Funcionario, 'senha'> {
  const { senha: _, ...resto } = f
  return resto
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(() => {
    const salvo = localStorage.getItem('aerocode_funcionarios')
    if (salvo) {
      try {
        return JSON.parse(salvo)
      } catch {
        return []
      }
    }
    return []
  })

  const [usuarioLogado, setUsuarioLogado] = useState<Funcionario | null>(null)

  const salvarFuncionarios = useCallback((lista: Funcionario[]) => {
    localStorage.setItem('aerocode_funcionarios', JSON.stringify(lista))
  }, [])

  const login = useCallback(
    async (usuario: string, senha: string): Promise<boolean> => {
      if (!usuario || !senha) return false

      for (const f of funcionarios) {
        if (f.usuario === usuario) {
          const ok = await verificarSenha(senha, f.senha)
          if (ok) {
            setUsuarioLogado(f)
            return true
          }
          return false
        }
      }
      return false
    },
    [funcionarios]
  )

  const logout = useCallback(() => {
    setUsuarioLogado(null)
  }, [])

  const cadastrarFuncionario = useCallback(
    async (
      nome: string,
      telefone: string,
      endereco: string,
      usuario: string,
      senha: string,
      nivelPermissao: NivelPermissao
    ): Promise<string> => {
      if (!nome.trim() || !usuario.trim() || !senha.trim()) return ''
      if (senha.length < 4) return ''
      if (funcionarios.some((f) => f.usuario === usuario)) return ''

      const senhaHash = await hashSenha(senha)
      const id = uuidv4()
      const novo: Funcionario = {
        id,
        nome: nome.trim(),
        telefone: telefone.trim(),
        endereco: endereco.trim(),
        usuario: usuario.trim(),
        senha: senhaHash,
        nivelPermissao,
      }

      const novaLista = [...funcionarios, novo]
      setFuncionarios(novaLista)
      salvarFuncionarios(novaLista)
      return id
    },
    [funcionarios, salvarFuncionarios]
  )

  const temPermissao = useCallback(
    (nivelNecessario: NivelPermissao): boolean => {
      if (!usuarioLogado) return false
      if (usuarioLogado.nivelPermissao === NivelPermissao.ADMINISTRADOR) return true

      const hierarquia: Record<NivelPermissao, number> = {
        [NivelPermissao.ADMINISTRADOR]: 3,
        [NivelPermissao.ENGENHEIRO]: 2,
        [NivelPermissao.OPERADOR]: 1,
      }

      return hierarquia[usuarioLogado.nivelPermissao] >= hierarquia[nivelNecessario]
    },
    [usuarioLogado]
  )

  const estaLogado = useCallback((): boolean => {
    return usuarioLogado !== null
  }, [usuarioLogado])

  const getUsuarioLogado = useCallback((): Omit<Funcionario, 'senha'> | null => {
    return usuarioLogado ? semSenha(usuarioLogado) : null
  }, [usuarioLogado])

  const precisaConfiguracaoInicial = useCallback((): boolean => {
    return funcionarios.length === 0
  }, [funcionarios])

  return (
    <AuthContext.Provider
      value={{
        funcionarios: funcionarios.map(semSenha),
        usuarioLogado: usuarioLogado ? semSenha(usuarioLogado) : null,
        login,
        logout,
        cadastrarFuncionario,
        temPermissao,
        estaLogado,
        getUsuarioLogado,
        precisaConfiguracaoInicial,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return context
}