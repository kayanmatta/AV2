import { type ReactNode, useCallback } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { NivelPermissao } from './types'
import { useKonamiCode } from './hooks/useKonamiCode'
 
import Login from './pages/Login'
import ConfiguracaoInicial from './pages/ConfiguracaoInicial'
import Dashboard from './pages/Dashboard'
import ListaAeronaves from './pages/ListaAeronaves'
import FormAeronave from './pages/FormAeronave'
import DetalhesAeronave from './pages/DetalhesAeronave'
import FormPeca from './pages/FormPeca'
import FormEtapa from './pages/FormEtapa'
import FormTeste from './pages/FormTeste'
import GerenciarEtapas from './pages/GerenciarEtapas'
import AssociarFuncionarios from './pages/AssociarFuncionarios'
import ListaFuncionarios from './pages/ListaFuncionarios'
import Relatorio from './pages/Relatorio'
import './App.css'

function RotaProtegida({
  children,
  nivelNecessario,
}: {
  children: ReactNode
  nivelNecessario?: NivelPermissao
}) {
  const { estaLogado, temPermissao, precisaConfiguracaoInicial } = useAuth()

  if (precisaConfiguracaoInicial()) {
    return <Navigate to="/configuracao-inicial" replace />
  }

  if (!estaLogado()) {
    return <Navigate to="/login" replace />
  }

  if (nivelNecessario && !temPermissao(nivelNecessario)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function EasterEgg() {
  const ativar = useCallback(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link) {
      link.href = '/pysandu.png'
      link.type = 'image/png'
    }
    document.title = '🏴‍☠️ AEROCODE'
  }, [])

  useKonamiCode(ativar)
  return null
}

function App() {
  return (
    <>
      <EasterEgg />
      <Routes>
      <Route path="/configuracao-inicial" element={<ConfiguracaoInicial />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<RotaProtegida><Dashboard /></RotaProtegida>} />
      <Route path="/aeronaves" element={<RotaProtegida><ListaAeronaves /></RotaProtegida>} />
      <Route path="/aeronaves/novo" element={<RotaProtegida nivelNecessario={NivelPermissao.ADMINISTRADOR}><FormAeronave /></RotaProtegida>} />
      <Route path="/aeronaves/:codigo" element={<RotaProtegida><DetalhesAeronave /></RotaProtegida>} />
      <Route path="/aeronaves/:codigo/editar" element={<RotaProtegida nivelNecessario={NivelPermissao.ADMINISTRADOR}><FormAeronave /></RotaProtegida>} />
      <Route path="/aeronaves/:codigo/gerenciar" element={<RotaProtegida nivelNecessario={NivelPermissao.ENGENHEIRO}><GerenciarEtapas /></RotaProtegida>} />
      <Route path="/aeronaves/:codigo/pecas/novo" element={<RotaProtegida nivelNecessario={NivelPermissao.ENGENHEIRO}><FormPeca /></RotaProtegida>} />
      <Route path="/aeronaves/:codigo/etapas/novo" element={<RotaProtegida nivelNecessario={NivelPermissao.ENGENHEIRO}><FormEtapa /></RotaProtegida>} />
      <Route path="/aeronaves/:codigo/testes/novo" element={<RotaProtegida nivelNecessario={NivelPermissao.ENGENHEIRO}><FormTeste /></RotaProtegida>} />
      <Route path="/aeronaves/:codigo/etapas/:etapaId/funcionarios" element={<RotaProtegida nivelNecessario={NivelPermissao.ENGENHEIRO}><AssociarFuncionarios /></RotaProtegida>} />
      <Route path="/funcionarios" element={<RotaProtegida nivelNecessario={NivelPermissao.ADMINISTRADOR}><ListaFuncionarios /></RotaProtegida>} />
      <Route path="/aeronaves/:codigo/relatorio" element={<RotaProtegida nivelNecessario={NivelPermissao.ADMINISTRADOR}><Relatorio /></RotaProtegida>} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </>
  )
}

export default App