/**
 * Testes para a Issue #10345 - "Old default file name (date) as 2024-01-12"
 *
 * Funcionalidade: Garantir que ao exportar um arquivo no Excalidraw,
 * o nome padrão reflita sempre a data e hora atuais, em vez de um valor fixo ou antigo.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { setDateTimeForTests, getDateTime } from "@excalidraw/common";

import { restoreAppState } from "../data/restore";
import { getDefaultAppState } from "../appState";

describe("Issue #10345 - Filename timestamp bug", () => {
  beforeEach(() => {
    setDateTimeForTests("");
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /**
   * CICLO 1: Teste da função getDateTime
   *
   * Verifica que a função utilitária getDateTime() gera sempre a data/hora atual
   * no formato correto: YYYY-MM-DD-HHMM
   */
  describe("Ciclo 1: getDateTime() deve gerar timestamp atual", () => {
    it("deve gerar nome de arquivo com data e hora atuais no formato YYYY-MM-DD-HHMM", () => {
      // Arrange: Define uma data específica
      const testDate = new Date("2024-11-21T14:30:00");
      vi.setSystemTime(testDate);

      // Act: Chama a função
      const result = getDateTime();

      // Assert: Verifica formato correto com a data atual
      expect(result).toBe("2024-11-21-1430");
    });

    it("deve sempre gerar timestamps diferentes para horários diferentes", () => {
      // Arrange & Act: Primeira chamada
      const firstDate = new Date("2024-11-21T10:00:00");
      vi.setSystemTime(firstDate);
      const firstResult = getDateTime();

      // Segunda chamada com horário diferente
      const secondDate = new Date("2024-11-21T15:30:00");
      vi.setSystemTime(secondDate);
      const secondResult = getDateTime();

      // Assert: Os resultados devem ser diferentes
      expect(firstResult).not.toBe(secondResult);
      expect(firstResult).toBe("2024-11-21-1000");
      expect(secondResult).toBe("2024-11-21-1530");
    });
  });

  /**
   * CICLO 2: Teste de restoreAppState
   *
   * ESTE É O BUG PRINCIPAL: Quando há um arquivo antigo salvo no localStorage,
   * ao criar um novo arquivo, o sistema está reutilizando o name antigo
   * em vez de usar null para permitir que getName() gere um novo timestamp.
   */
  describe("Ciclo 2: restoreAppState NÃO deve reutilizar name antigo para novo arquivo", () => {
    it("FALHA ESPERADA: deve retornar name=null quando não há appState importado e deve ignorar localAppState.name antigo", () => {
      // Arrange: Simula um arquivo antigo salvo no localStorage
      const oldDate = new Date("2024-01-12T09:35:00");
      vi.setSystemTime(oldDate);
      const oldTimestamp = getDateTime(); // "2024-01-12-0935"

      const localAppState = {
        ...getDefaultAppState(),
        name: `Untitled-${oldTimestamp}`, // Nome antigo salvo
      };

      // Act: Restaura o estado como se estivesse criando um novo arquivo
      // (sem appState importado - o que acontece quando você abre excalidraw.com)
      const currentDate = new Date("2024-11-21T14:30:00");
      vi.setSystemTime(currentDate);

      const restoredState = restoreAppState(null, localAppState);

      // Assert: Para um NOVO arquivo, name deveria ser null
      // (permitindo que getName() gere um timestamp atual)
      // MAS o código atual retorna o name antigo do localStorage!
      expect(restoredState.name).toBe(null); // ESTE TESTE VAI FALHAR - É O BUG!
    });

    it("deve preservar o name quando está restaurando um arquivo existente (importado)", () => {
      // Arrange: Simula a abertura de um arquivo salvo
      const savedFileName = "MeuDesenho-2024-01-12-0935";
      const importedAppState = {
        ...getDefaultAppState(),
        name: savedFileName,
      };

      const localAppState = {
        ...getDefaultAppState(),
        name: "OutroNome",
      };

      // Act: Restaura o arquivo importado
      const restoredState = restoreAppState(importedAppState, localAppState);

      // Assert: Deve preservar o nome do arquivo importado
      expect(restoredState.name).toBe(savedFileName);
    });
  });

  /**
   * CICLO 3: Teste de integração - getName()
   *
   * Verifica que o método getName() (usado na exportação) sempre
   * retorna um timestamp atual quando name é null.
   */
  describe("Ciclo 3: Integração - Comportamento esperado no fluxo completo", () => {
    it("quando name é null, deve usar timestamp atual na exportação", () => {
      // Arrange: Estado de um novo arquivo (name = null)
      const currentDate = new Date("2024-11-21T14:30:00");
      vi.setSystemTime(currentDate);

      const appState = {
        ...getDefaultAppState(),
        name: null, // Novo arquivo, sem nome
      };

      // Act: Simula o que getName() faz
      const exportName = appState.name || `Untitled-${getDateTime()}`;

      // Assert: Deve gerar com timestamp atual
      expect(exportName).toBe("Untitled-2024-11-21-1430");
      expect(exportName).not.toContain("2024-01-12"); // NÃO deve usar data antiga
    });

    it("quando name tem valor, deve usar esse valor na exportação", () => {
      // Arrange: Arquivo com nome definido
      const appState = {
        ...getDefaultAppState(),
        name: "MeuDesenho-2024-01-12-0935",
      };

      // Act
      const exportName = appState.name || `Untitled-${getDateTime()}`;

      // Assert: Deve usar o nome existente
      expect(exportName).toBe("MeuDesenho-2024-01-12-0935");
    });
  });
});
