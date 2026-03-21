/**
 * EXEMPLOS DE USO - Validadores de Gastos
 * 
 * Este arquivo demonstra como usar os validadores em diferentes cenários
 */

import { GastosValidator, GastosValidationBuilder, VALIDATION_ERRORS } from './gastos.validators';
import { BadRequestException } from '@nestjs/common';
import { Gastos } from '../schemas/gastos.schema';

// ============================================================================
// EXEMPLO 1: Validação Completa (Uso Padrão no Service)
// ============================================================================

export class Exemplo1_ValidacaoCompleta {
  // Isso é usado em gastos.service.ts
  async criar(dados: Partial<Gastos>) {
    // Valida TODOS os campos obrigatórios
    GastosValidator.validateAll(dados, false);

    // Se chegou aqui, dados são válidos
    console.log('Dados válidos, prossegue com criação...');
  }

  async atualizar(gastosId: string, dados: Partial<Gastos>) {
    // Valida apenas campos FORNECIDOS (opcionais)
    GastosValidator.validateAll(dados, true);

    console.log('Dados válidos para atualização, prossegue...');
  }
}

// ============================================================================
// EXEMPLO 2: Validações Individuais
// ============================================================================

export class Exemplo2_ValidacoesIndividuais {
  validarApenas_Descricao(descricao: string) {
    try {
      GastosValidator.validateDescricao(descricao);
      console.log('✓ Descrição válida');
    } catch (error) {
      console.error('✗ Descrição inválida:', error);
    }
  }

  validarApenas_Valor(valor: number) {
    try {
      GastosValidator.validateValor(valor);
      console.log('✓ Valor válido');
    } catch (error) {
      console.error('✗ Valor inválido:', error);
    }
  }

  validarApenas_TipoDeGastoId(tipoDeGastoId: string) {
    try {
      GastosValidator.validateTipoDeGastoId(tipoDeGastoId);
      console.log('✓ Tipo de Gasto ID válido');
    } catch (error) {
      console.error('✗ Tipo de Gasto ID inválido:', error);
    }
  }
}

// ============================================================================
// EXEMPLO 3: Tratamento de Erros
// ============================================================================

export class Exemplo3_TratamentoErros {
  async criar(dados: Partial<Gastos>) {
    try {
      GastosValidator.validateAll(dados, false);
      console.log('Sucesso!');
    } catch (error) {
      if (error instanceof BadRequestException) {
        const mensagem = error.getResponse();
        console.error('Erro de validação:', mensagem);
        // Enviar resposta HTTP 400 para o cliente
      } else {
        throw error;
      }
    }
  }

  async criarComTratamentoCustomizado(dados: Partial<Gastos>) {
    try {
      GastosValidator.validateAll(dados, false);
    } catch (error) {
      if (error instanceof BadRequestException) {
        console.error('Validação falhou. Detalhes:', {
          mensagem: error.message,
          status: error.getStatus(),
        });
      }
    }
  }
}

// ============================================================================
// EXEMPLO 4: Usando Mensagens de Erro Constantes
// ============================================================================

export class Exemplo4_MensagensErro {
  demonstreMensagens() {
    // Acessar constantes de erro
    console.log('Mensagens de Descrição:');
    console.log(VALIDATION_ERRORS.DESCRICAO.REQUIRED);      // "A descrição do gasto é obrigatória"
    console.log(VALIDATION_ERRORS.DESCRICAO.TOO_SHORT);     // "A descrição deve ter pelo menos 3 caracteres"
    console.log(VALIDATION_ERRORS.DESCRICAO.TOO_LONG);      // "A descrição não pode ter mais de 255 caracteres"

    console.log('\nMensagens de Valor:');
    console.log(VALIDATION_ERRORS.VALOR.REQUIRED);          // "O valor do gasto é obrigatório"
    console.log(VALIDATION_ERRORS.VALOR.INVALID_VALUE);     // "O valor deve ser maior que zero"
    console.log(VALIDATION_ERRORS.VALOR.DECIMAL_PLACES);    // "O valor deve ter no máximo 2 casas decimais"

    console.log('\nMensagens de Tipo de Gasto:');
    console.log(VALIDATION_ERRORS.TIPO_GASTO_ID.REQUIRED);  // "O tipo de gasto é obrigatório"
    console.log(VALIDATION_ERRORS.TIPO_GASTO_ID.INVALID_FORMAT); // "O tipo de gasto deve ser um ID válido"
  }
}

// ============================================================================
// EXEMPLO 5: Builder Pattern para Regras Customizadas
// ============================================================================

export class Exemplo5_BuilderPattern {
  validarComRegrasCustomizadas(dados: Partial<Gastos>) {
    try {
      new GastosValidationBuilder()
        // Validação padrão
        .addRule('descricao', () => {
          GastosValidator.validateDescricao(dados.descricao);
        })
        // Validação customizada
        .addRule('valor-minimo', () => {
          if (dados.valor && dados.valor < 50) {
            throw new BadRequestException('O valor mínimo é R$ 50');
          }
        })
        // Outra validação customizada
        .addRule('tipo-gasto-valido', () => {
          GastosValidator.validateTipoDeGastoId(dados.tipoDeGastoId);
        })
        .validate();

      console.log('Todas as validações passaram!');
    } catch (error) {
      console.error('Erro na validação:', error);
    }
  }
}

// ============================================================================
// EXEMPLO 6: Casos de Uso Reais
// ============================================================================

export class Exemplo6_CasosReais {
  // Criar novo gasto
  async criarNovoGasto() {
    const novoGasto: Partial<Gastos> = {
      descricao: 'Aluguel Escritório',
      valor: 2500.00,
      tipoDeGastoId: '507f1f77bcf86cd799439011',
    };

    try {
      GastosValidator.validateAll(novoGasto, false);
      console.log('✓ Gasto pronto para ser criado');
    } catch (error) {
      console.error('✗ Erro:', error);
    }
  }

  // Atualizar descrição apenas
  async atualizarDescricao() {
    const atualizacao: Partial<Gastos> = {
      descricao: 'Aluguel Escritório - SP',
    };

    try {
      // isUpdate = true permite campos opcionais
      GastosValidator.validateAll(atualizacao, true);
      console.log('✓ Descrição pronta para ser atualizada');
    } catch (error) {
      console.error('✗ Erro:', error);
    }
  }

  // Atualizar múltiplos campos
  async atualizarMultiplosCampos() {
    const atualizacao: Partial<Gastos> = {
      descricao: 'Aluguel novo',
      valor: 3000.00,
    };

    try {
      GastosValidator.validateAll(atualizacao, true);
      console.log('✓ Atualização pronta');
    } catch (error) {
      console.error('✗ Erro:', error);
    }
  }

  // Tentar criar com dados inválidos
  async tentarCriarInvalido() {
    const dadosInvalidos: Partial<Gastos> = {
      descricao: 'AB', // Muito curto!
      valor: -100, // Negativo!
      tipoDeGastoId: 'invalid-id', // Não é ObjectId!
    };

    try {
      GastosValidator.validateAll(dadosInvalidos, false);
    } catch (error: any) {
      // Erro será lançado na primeira validação falha
      console.error('✗ Erro esperado:', error.message);
    }
  }

  // Validação progressiva
  async validacaoProgressiva(dados: Partial<Gastos>) {
    try {
      // Validar cada campo individualmente
      if (dados.descricao) {
        GastosValidator.validateDescricao(dados.descricao);
        console.log('✓ Descrição válida');
      }

      if (dados.valor) {
        GastosValidator.validateValor(dados.valor);
        console.log('✓ Valor válido');
      }

      if (dados.tipoDeGastoId) {
        GastosValidator.validateTipoDeGastoId(dados.tipoDeGastoId);
        console.log('✓ Tipo de Gasto válido');
      }

      console.log('✓ Todos os campos fornecidos são válidos');
    } catch (error) {
      console.error('✗ Campo inválido:', error);
    }
  }
}

// ============================================================================
// EXEMPLO 7: Integração com Testes
// ============================================================================

export class Exemplo7_Testes {
  // Teste: criar com dados válidos
  testCriarComDadosValidos() {
    const dados: Partial<Gastos> = {
      descricao: 'Despesa de Escritório',
      valor: 150.50,
      tipoDeGastoId: '507f1f77bcf86cd799439011',
    };

    expect(() => {
      GastosValidator.validateAll(dados, false);
    }).not.toThrow();
  }

  // Teste: criar com descrição inválida
  testCriarComDescricaoInvalida() {
    const dados: Partial<Gastos> = {
      descricao: 'AB',
      valor: 150.50,
      tipoDeGastoId: '507f1f77bcf86cd799439011',
    };

    expect(() => {
      GastosValidator.validateAll(dados, false);
    }).toThrow(BadRequestException);
  }

  // Teste: atualização parcial
  testAtualizacaoParcial() {
    const dados: Partial<Gastos> = {
      valor: 200.00,
    };

    expect(() => {
      GastosValidator.validateAll(dados, true);
    }).not.toThrow();
  }

  // Teste: atualização com dados inválidos
  testAtualizacaoComDadosInvalidos() {
    const dados: Partial<Gastos> = {
      valor: -100,
    };

    expect(() => {
      GastosValidator.validateAll(dados, true);
    }).toThrow(BadRequestException);
  }
}

// ============================================================================
// EXEMPLO 8: Estendendo Validadores
// ============================================================================

export class GastosValidatorExtendido extends GastosValidator {
  /**
   * Valida se o valor é um múltiplo de 0.50 (útil para alguns negócios)
   */
  static validateValorMultiplo50(valor: any): void {
    this.validateValor(valor);
    
    if ((valor * 100) % 50 !== 0) {
      throw new BadRequestException(
        'O valor deve ser um múltiplo de R$ 0.50'
      );
    }
  }

  /**
   * Valida com limite de valor personalizado
   */
  static validateValorComLimite(valor: any, limiteMaximo: number): void {
    if (typeof valor !== 'number' || valor <= 0) {
      throw new BadRequestException('Valor inválido');
    }

    if (valor > limiteMaximo) {
      throw new BadRequestException(
        `Valor não pode exceeder R$ ${limiteMaximo}`
      );
    }
  }
}

// ============================================================================
// Executar Exemplos
// ============================================================================

async function executarExemplos() {
  console.log('='.repeat(80));
  console.log('EXEMPLOS DE USO - VALIDADORES DE GASTOS');
  console.log('='.repeat(80));

  // Exemplo 1
  console.log('\n[EXEMPLO 1] Validação Completa');
  const ex1 = new Exemplo1_ValidacaoCompleta();
  await ex1.criar({
    descricao: 'Despesa Válida',
    valor: 100,
    tipoDeGastoId: '507f1f77bcf86cd799439011',
  });

  // Exemplo 2
  console.log('\n[EXEMPLO 2] Validações Individuais');
  const ex2 = new Exemplo2_ValidacoesIndividuais();
  ex2.validarApenas_Descricao('Descrição Válida');
  ex2.validarApenas_Valor(150.50);

  // Exemplo 4
  console.log('\n[EXEMPLO 4] Mensagens de Erro');
  const ex4 = new Exemplo4_MensagensErro();
  ex4.demonstreMensagens();

  // Exemplo 6
  console.log('\n[EXEMPLO 6] Casos Reais');
  const ex6 = new Exemplo6_CasosReais();
  await ex6.criarNovoGasto();
  await ex6.atualizarDescricao();
}

// Descomente para executar
// executarExemplos().catch(console.error);
