import { BadRequestException } from '@nestjs/common';
import { Lancamentos } from '../schemas/lancamentos.schema';

/**
 * Exceções padrão para validações
 */
export const VALIDATION_ERRORS = {
  PRODUTO_NAME: {
    REQUIRED: 'O nome do produto é obrigatório',
    INVALID_TYPE: 'O nome do produto deve ser uma string',
    EMPTY: 'O nome do produto não pode estar vazio',
  },
  QUANTITY: {
    REQUIRED: 'A quantidade é obrigatória',
    INVALID_TYPE: 'A quantidade deve ser um número',
    INVALID_VALUE: 'A quantidade deve ser maior que zero',
  },
  VALUE: {
    REQUIRED: 'O valor é obrigatório',
    INVALID_TYPE: 'O valor deve ser um número',
    INVALID_VALUE: 'O valor deve ser maior que zero',
  },
  ANO: {
    REQUIRED: 'O ano é obrigatório',
    INVALID_TYPE: 'O ano deve ser um número',
    INVALID_RANGE: 'O ano deve estar entre 1900 e 2100',
  },
  MES: {
    REQUIRED: 'O mês é obrigatório',
    INVALID_TYPE: 'O mês deve ser um número',
    INVALID_RANGE: 'O mês deve estar entre 1 e 12',
  },
  EMBALAGEM_ID: {
    REQUIRED: 'O ID da embalagem é obrigatório',
    INVALID_TYPE: 'O ID da embalagem deve ser uma string',
  },
  CATEGORIA: {
    REQUIRED: 'A categoria é obrigatória',
    INVALID_TYPE: 'A categoria deve ser uma string',
    EMPTY: 'A categoria não pode estar vazia',
  },
  MES_NOME: {
    REQUIRED: 'O nome do mês é obrigatório',
    INVALID_TYPE: 'O nome do mês deve ser uma string',
    EMPTY: 'O nome do mês não pode estar vazio',
  },
  MEDIDA_ID: {
    REQUIRED: 'O ID da medida é obrigatório',
    INVALID_TYPE: 'O ID da medida deve ser uma string',
  },
  TIPO_PRODUTO_ID: {
    REQUIRED: 'O ID do tipo de produto é obrigatório',
    INVALID_TYPE: 'O ID do tipo de produto deve ser uma string',
  },
} as const;

/**
 * Validador genérico para strings obrigatórias
 */
export const validateRequiredString = (
  value: any,
  fieldName: string,
  minLength: number = 1,
): void => {
  if (value === undefined || value === null) {
    throw new BadRequestException(`${fieldName} é obrigatório`);
  }

  if (typeof value !== 'string') {
    throw new BadRequestException(`${fieldName} deve ser uma string`);
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    throw new BadRequestException(`${fieldName} não pode estar vazio`);
  }

  if (minLength > 0 && trimmedValue.length < minLength) {
    throw new BadRequestException(
      `${fieldName} deve ter no mínimo ${minLength} caracteres`,
    );
  }
};

/**
 * Validador genérico para números obrigatórios
 */
export const validateRequiredNumber = (
  value: any,
  fieldName: string,
): void => {
  if (value === undefined || value === null) {
    throw new BadRequestException(`${fieldName} é obrigatório`);
  }

  if (typeof value !== 'number' || isNaN(value)) {
    throw new BadRequestException(`${fieldName} deve ser um número válido`);
  }
};

/**
 * Validador para números positivos
 */
export const validatePositiveNumber = (
  value: any,
  fieldName: string,
): void => {
  validateRequiredNumber(value, fieldName);

  if (value <= 0) {
    throw new BadRequestException(
      `${fieldName} deve ser maior que zero`,
    );
  }
};

/**
 * Validador para números em intervalo
 */
export const validateNumberRange = (
  value: any,
  fieldName: string,
  min: number,
  max: number,
): void => {
  validateRequiredNumber(value, fieldName);

  if (value < min || value > max) {
    throw new BadRequestException(
      `${fieldName} deve estar entre ${min} e ${max}`,
    );
  }
};

/**
 * Validador principal para dados de Lancamentos
 */
export class LancamentosValidator {
  private static readonly MONTHS_VALID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  /**
   * Valida nome do produto
   */
  static validateProdutoName(produtoName: any, isUpdate: boolean = false): void {
    if (isUpdate && produtoName === undefined) {
      return;
    }
    validateRequiredString(produtoName, 'O nome do produto', 1);
  }

  /**
   * Valida quantidade
   */
  static validateQuantity(quantity: any, isUpdate: boolean = false): void {
    if (isUpdate && quantity === undefined) {
      return;
    }
    validatePositiveNumber(quantity, 'A quantidade');
  }

  /**
   * Valida valor
   */
  static validateValue(value: any, isUpdate: boolean = false): void {
    if (isUpdate && value === undefined) {
      return;
    }
    validatePositiveNumber(value, 'O valor');
  }

  /**
   * Valida ano
   */
  static validateAno(ano: any, isUpdate: boolean = false): void {
    if (isUpdate && ano === undefined) {
      return;
    }
    validateNumberRange(ano, 'O ano', 1900, 2100);
  }

  /**
   * Valida mês
   */
  static validateMes(mes: any, isUpdate: boolean = false): void {
    if (isUpdate && mes === undefined) {
      return;
    }
    validateRequiredNumber(mes, 'O mês');
    
    if (!this.MONTHS_VALID.includes(mes)) {
      throw new BadRequestException('O mês deve estar entre 1 e 12');
    }
  }

  /**
   * Valida ID da embalagem
   */
  static validateEmbalagemId(embalagemId: any, isUpdate: boolean = false): void {
    if (isUpdate && embalagemId === undefined) {
      return;
    }
    validateRequiredString(embalagemId, 'O ID da embalagem', 1);
  }

  /**
   * Valida categoria
   */
  static validateCategoria(categoria: any, isUpdate: boolean = false): void {
    if (isUpdate && categoria === undefined) {
      return;
    }
    validateRequiredString(categoria, 'A categoria', 1);
  }

  /**
   * Valida nome do mês
   */
  static validateMesNome(mesNome: any, isUpdate: boolean = false): void {
    if (isUpdate && mesNome === undefined) {
      return;
    }
    validateRequiredString(mesNome, 'O nome do mês', 1);
  }

  /**
   * Valida ID da medida
   */
  static validateMedidaId(medidaId: any, isUpdate: boolean = false): void {
    if (isUpdate && medidaId === undefined) {
      return;
    }
    validateRequiredString(medidaId, 'O ID da medida', 1);
  }

  /**
   * Valida ID do tipo de produto
   */
  static validateTipoProdutoId(tipoProdutoId: any, isUpdate: boolean = false): void {
    if (isUpdate && tipoProdutoId === undefined) {
      return;
    }
    validateRequiredString(tipoProdutoId, 'O ID do tipo de produto', 1);
  }

  /**
   * Valida todos os dados de lançamento
   */
  static validateAll(dados: Partial<Lancamentos>, isUpdate: boolean = false): void {
    if (!dados || Object.keys(dados).length === 0) {
      if (!isUpdate) {
        throw new BadRequestException('Nenhum dado fornecido para validação');
      }
      return;
    }

    this.validateProdutoName(dados.produtoName, isUpdate);
    this.validateQuantity(dados.quantity, isUpdate);
    this.validateValue(dados.value, isUpdate);
    this.validateAno(dados.ano, isUpdate);
    this.validateMes(dados.mes, isUpdate);
    this.validateEmbalagemId(dados.embalagemId, isUpdate);
    this.validateCategoria(dados.categoria, isUpdate);
    this.validateMesNome(dados.mesNome, isUpdate);
    this.validateMedidaId(dados.medidaId, isUpdate);
    this.validateTipoProdutoId(dados.tipoProdutoId, isUpdate);
  }
}

/**
 * Validador para filtros
 */
export class LancamentosFilterValidator {
  private static readonly MONTHS_VALID = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  /**
   * Valida ano do filtro
   */
  static validateAno(ano: any): void {
    if (ano !== undefined) {
      validateNumberRange(ano, 'O ano', 1900, 2100);
    }
  }

  /**
   * Valida mês do filtro
   */
  static validateMes(mes: any): void {
    if (mes !== undefined) {
      validateRequiredNumber(mes, 'O mês');
      
      if (!this.MONTHS_VALID.includes(mes)) {
        throw new BadRequestException('O mês deve estar entre 1 e 12');
      }
    }
  }

  /**
   * Valida ordem de classificação
   */
  static validateOrder(order: any): void {
    if (order !== undefined && !['asc', 'desc'].includes(order)) {
      throw new BadRequestException('A ordem deve ser asc ou desc');
    }
  }

  /**
   * Valida todos os filtros
   */
  static validateAll(params: {
    ano?: number;
    mes?: number;
    produtoId?: string;
    categoria?: string;
    data_gte?: string;
    data_lte?: string;
    _sort?: string;
    _order?: 'asc' | 'desc';
  }): void {
    this.validateAno(params.ano);
    this.validateMes(params.mes);
    this.validateOrder(params._order);
  }
}
