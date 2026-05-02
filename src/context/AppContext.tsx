import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Aeronave,
  Peca,
  Etapa,
  Teste,
  TipoAeronave,
  TipoPeca,
  StatusPeca,
  StatusEtapa,
  TipoTeste,
  ResultadoTeste,
} from '../types';

interface AppContextType {
  aeronaves: Aeronave[];
  cadastrarAeronave: (modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) => string;
  editarAeronave: (codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number) => boolean;
  excluirAeronave: (codigo: string) => boolean;
  buscarAeronave: (codigo: string) => Aeronave | undefined;
  adicionarPeca: (codigoAeronave: string, nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca) => boolean;
  atualizarStatusPeca: (codigoAeronave: string, pecaId: string, novoStatus: StatusPeca) => boolean;
  adicionarEtapa: (codigoAeronave: string, nome: string, prazo: string) => boolean;
  iniciarEtapa: (codigoAeronave: string, etapaId: string) => boolean;
  finalizarEtapa: (codigoAeronave: string, etapaId: string) => boolean;
  associarFuncionarioEtapa: (codigoAeronave: string, etapaId: string, funcionarioId: string) => boolean;
  adicionarTeste: (codigoAeronave: string, tipo: TipoTeste, resultado: ResultadoTeste) => boolean;
  editarEtapa: (codigoAeronave: string, etapaId: string, nome: string, prazo: string) => boolean;
  excluirEtapa: (codigoAeronave: string, etapaId: string) => boolean;
  excluirPeca: (codigoAeronave: string, pecaId: string) => boolean;
  gerarRelatorio: (codigoAeronave: string, cliente: string) => string;
}

const AppContext = createContext<AppContextType | null>(null);

function gerarCodigoAeronave(): string {
  const prefixo = 'EMB';
  const numero = Math.floor(Math.random() * 9000) + 1000;
  return prefixo + numero;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>(() => {
    const salvo = localStorage.getItem('aerocode_aeronaves');
    if (salvo) {
      try {
        return JSON.parse(salvo);
      } catch {
        return [];
      }
    }
    return [];
  });

  const salvar = useCallback((lista: Aeronave[]) => {
    localStorage.setItem('aerocode_aeronaves', JSON.stringify(lista));
  }, []);

  const buscarAeronave = useCallback(
    (codigo: string): Aeronave | undefined => {
      return aeronaves.find((a) => a.codigo === codigo);
    },
    [aeronaves]
  );

  const cadastrarAeronave = useCallback(
    (modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number): string => {
      let codigo = gerarCodigoAeronave();
      while (aeronaves.some((a) => a.codigo === codigo)) {
        codigo = gerarCodigoAeronave();
      }

      const nova: Aeronave = {
        codigo,
        modelo,
        tipo,
        capacidade,
        alcance,
        pecas: [],
        etapas: [],
        testes: [],
      };

      const novaLista = [...aeronaves, nova];
      setAeronaves(novaLista);
      salvar(novaLista);
      return codigo;
    },
    [aeronaves, salvar]
  );

  const editarAeronave = useCallback(
    (codigo: string, modelo: string, tipo: TipoAeronave, capacidade: number, alcance: number): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigo);
      if (index === -1) return false;

      const novaLista = [...aeronaves];
      novaLista[index] = { ...novaLista[index], modelo, tipo, capacidade, alcance };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const excluirAeronave = useCallback(
    (codigo: string): boolean => {
      const novaLista = aeronaves.filter((a) => a.codigo !== codigo);
      if (novaLista.length === aeronaves.length) return false;
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const adicionarPeca = useCallback(
    (codigoAeronave: string, nome: string, tipo: TipoPeca, fornecedor: string, status: StatusPeca): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const novaPeca: Peca = {
        id: uuidv4(),
        nome,
        tipo,
        fornecedor,
        status,
      };

      const novaLista = [...aeronaves];
      novaLista[index] = {
        ...novaLista[index],
        pecas: [...novaLista[index].pecas, novaPeca],
      };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const atualizarStatusPeca = useCallback(
    (codigoAeronave: string, pecaId: string, novoStatus: StatusPeca): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const pecaIndex = aeronaves[index].pecas.findIndex((p) => p.id === pecaId);
      if (pecaIndex === -1) return false;

      const novaLista = [...aeronaves];
      const novasPecas = [...novaLista[index].pecas];
      novasPecas[pecaIndex] = { ...novasPecas[pecaIndex], status: novoStatus };
      novaLista[index] = { ...novaLista[index], pecas: novasPecas };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const excluirPeca = useCallback(
    (codigoAeronave: string, pecaId: string): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const novaLista = [...aeronaves];
      novaLista[index] = {
        ...novaLista[index],
        pecas: novaLista[index].pecas.filter((p) => p.id !== pecaId),
      };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const adicionarEtapa = useCallback(
    (codigoAeronave: string, nome: string, prazo: string): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const ordem = aeronaves[index].etapas.length + 1;
      const novaEtapa: Etapa = {
        id: uuidv4(),
        nome,
        prazo,
        status: StatusEtapa.PENDENTE,
        ordem,
        funcionarios: [],
      };

      const novaLista = [...aeronaves];
      novaLista[index] = {
        ...novaLista[index],
        etapas: [...novaLista[index].etapas, novaEtapa],
      };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const editarEtapa = useCallback(
    (codigoAeronave: string, etapaId: string, nome: string, prazo: string): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const etapaIndex = aeronaves[index].etapas.findIndex((e) => e.id === etapaId);
      if (etapaIndex === -1) return false;

      const novaLista = [...aeronaves];
      const novasEtapas = [...novaLista[index].etapas];
      novasEtapas[etapaIndex] = { ...novasEtapas[etapaIndex], nome, prazo };
      novaLista[index] = { ...novaLista[index], etapas: novasEtapas };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const excluirEtapa = useCallback(
    (codigoAeronave: string, etapaId: string): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const novaLista = [...aeronaves];
      const novasEtapas = novaLista[index].etapas
        .filter((e) => e.id !== etapaId)
        .map((e, i) => ({ ...e, ordem: i + 1 }));
      novaLista[index] = { ...novaLista[index], etapas: novasEtapas };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const iniciarEtapa = useCallback(
    (codigoAeronave: string, etapaId: string): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const etapaIndex = aeronaves[index].etapas.findIndex((e) => e.id === etapaId);
      if (etapaIndex === -1) return false;

      const etapa = aeronaves[index].etapas[etapaIndex];
      if (etapa.status !== StatusEtapa.PENDENTE) return false;

      // Verifica se a etapa anterior foi concluída
      if (etapa.ordem > 1) {
        const anterior = aeronaves[index].etapas.find((e) => e.ordem === etapa.ordem - 1);
        if (anterior && anterior.status !== StatusEtapa.CONCLUIDA) return false;
      }

      const novaLista = [...aeronaves];
      const novasEtapas = [...novaLista[index].etapas];
      novasEtapas[etapaIndex] = { ...novasEtapas[etapaIndex], status: StatusEtapa.EM_ANDAMENTO };
      novaLista[index] = { ...novaLista[index], etapas: novasEtapas };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const finalizarEtapa = useCallback(
    (codigoAeronave: string, etapaId: string): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const etapaIndex = aeronaves[index].etapas.findIndex((e) => e.id === etapaId);
      if (etapaIndex === -1) return false;

      const etapa = aeronaves[index].etapas[etapaIndex];
      if (etapa.status !== StatusEtapa.EM_ANDAMENTO) return false;

      // 🔒 CRÍTICA 2 CORRIGIDA: não pode finalizar sem funcionário vinculado
      if (etapa.funcionarios.length === 0) return false;

      const novaLista = [...aeronaves];
      const novasEtapas = [...novaLista[index].etapas];
      novasEtapas[etapaIndex] = { ...novasEtapas[etapaIndex], status: StatusEtapa.CONCLUIDA };
      novaLista[index] = { ...novaLista[index], etapas: novasEtapas };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const associarFuncionarioEtapa = useCallback(
    (codigoAeronave: string, etapaId: string, funcionarioId: string): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const etapaIndex = aeronaves[index].etapas.findIndex((e) => e.id === etapaId);
      if (etapaIndex === -1) return false;

      const etapa = aeronaves[index].etapas[etapaIndex];
      // Evita duplicidade
      if (etapa.funcionarios.includes(funcionarioId)) return false;

      const novaLista = [...aeronaves];
      const novasEtapas = [...novaLista[index].etapas];
      novasEtapas[etapaIndex] = {
        ...novasEtapas[etapaIndex],
        funcionarios: [...novasEtapas[etapaIndex].funcionarios, funcionarioId],
      };
      novaLista[index] = { ...novaLista[index], etapas: novasEtapas };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const adicionarTeste = useCallback(
    (codigoAeronave: string, tipo: TipoTeste, resultado: ResultadoTeste): boolean => {
      const index = aeronaves.findIndex((a) => a.codigo === codigoAeronave);
      if (index === -1) return false;

      const novoTeste: Teste = {
        id: uuidv4(),
        tipo,
        resultado,
        data: new Date().toLocaleDateString('pt-BR'),
      };

      const novaLista = [...aeronaves];
      novaLista[index] = {
        ...novaLista[index],
        testes: [...novaLista[index].testes, novoTeste],
      };
      setAeronaves(novaLista);
      salvar(novaLista);
      return true;
    },
    [aeronaves, salvar]
  );

  const gerarRelatorio = useCallback(
    (codigoAeronave: string, cliente: string): string => {
      const aeronave = aeronaves.find((a) => a.codigo === codigoAeronave);
      if (!aeronave) return '';

      const linhas: string[] = [];
      linhas.push('========================================');
      linhas.push('   AEROCODE - RELATÓRIO DE ENTREGA');
      linhas.push('========================================');
      linhas.push('');
      linhas.push(`Código: ${aeronave.codigo}`);
      linhas.push(`Modelo: ${aeronave.modelo}`);
      linhas.push(`Tipo: ${aeronave.tipo}`);
      linhas.push(`Capacidade: ${aeronave.capacidade} passageiros`);
      linhas.push(`Alcance: ${aeronave.alcance} km`);
      linhas.push(`Cliente: ${cliente}`);
      linhas.push(`Data: ${new Date().toLocaleDateString('pt-BR')}`);
      linhas.push('');
      linhas.push('--- PEÇAS ---');
      if (aeronave.pecas.length === 0) {
        linhas.push('Nenhuma peça registrada.');
      } else {
        aeronave.pecas.forEach((p) => {
          linhas.push(`• ${p.nome} (${p.tipo}) - ${p.fornecedor} [${p.status}]`);
        });
      }
      linhas.push('');
      linhas.push('--- ETAPAS ---');
      if (aeronave.etapas.length === 0) {
        linhas.push('Nenhuma etapa registrada.');
      } else {
        aeronave.etapas.forEach((e) => {
          linhas.push(`• ${e.ordem}. ${e.nome} - Prazo: ${e.prazo} [${e.status}]`);
          linhas.push(`  Funcionários vinculados: ${e.funcionarios.length}`);
        });
      }
      linhas.push('');
      linhas.push('--- TESTES ---');
      if (aeronave.testes.length === 0) {
        linhas.push('Nenhum teste registrado.');
      } else {
        aeronave.testes.forEach((t) => {
          linhas.push(`• ${t.tipo} - ${t.resultado} (${t.data})`);
        });
      }
      linhas.push('');
      linhas.push('========================================');

      return linhas.join('\n');
    },
    [aeronaves]
  );

  return (
    <AppContext.Provider
      value={{
        aeronaves,
        cadastrarAeronave,
        editarAeronave,
        excluirAeronave,
        buscarAeronave,
        adicionarPeca,
        atualizarStatusPeca,
        adicionarEtapa,
        iniciarEtapa,
        finalizarEtapa,
        associarFuncionarioEtapa,
        adicionarTeste,
        editarEtapa,
        excluirEtapa,
        excluirPeca,
        gerarRelatorio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
}