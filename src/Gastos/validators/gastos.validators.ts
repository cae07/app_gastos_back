import { BadRequestException } from '@nestjs/common';
import { Gastos } from '../schemas/gastos.schema';

/**
 * Exceções padrão para validações
 */
export const VALIDATION_ERRORS = {
  DESCRICAO: {
    REQUIRED: 'A descrição do gasto é obrigatória',
    INVALID_TYPE: 'A descrição deve ser uma string',
    EMPTY: 'A descrição não pode estar vazia',
    TOO_SHORT: 'A descrição deve ter pelo menos 3 caracteres',
    TOO_LONG: 'A descrição não pode ter mais de 255 caracteres',
  },
  VALOR: {
    REQUIRED: 'O valor do gasto é obrigatório',
    INVALID_TYPE: 'O valor deve ser um número',
    INVALID_VALUE: 'O valor deve ser maior que zero',
    MAX_VALUE: 'O valor não pode ser maior que 999999999.99',
    DECIMAL_PLACES: 'O valor deve ter no máximo 2 casas decimais',
  },
  TIPO_GASTO_ID: {
    REQUIRED: 'O tipo de gasto é obrigatório',
    INVALID_TYPE: 'O tipo de gasto deve ser uma string',
    INVALID_FORMAT: 'O tipo de gasto deve ser um ID válido',
  },
} as const;

/**
 * Interface para validação flexível
 */
interface ValidationRule {
  field: string;
  validate: () => void;
}

/**
 * Validador genérico para strings obrigatórias
 */
export const validateRequiredString = (
  value: any,
  fieldName: string,
  minLength: number = 1,
  maxLength: number = 255,
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

  if (trimmedValue.length < minLength) {
    throw new BadRequestException(
      `${fieldName} deve ter no mínimo ${minLength} caracteres`,
    );
  }

  if (trimmedValue.length > maxLength) {
    throw new BadRequestException(
      `${fieldName} não pode ter mais de ${maxLength} caracteres`,
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
  minValue: number = 0,
): void => {
  validateRequiredNumber(value, fieldName);

  if (value <= minValue) {
    throw new BadRequestException(
      `${fieldName} deve ser maior que ${minValue}`,
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
 * Validador para casas decimais
 */
export const validateDecimalPlaces = (
  value: number,
  fieldName: string,
  decimalPlaces: number = 2,
): void => {
  const pattern = new RegExp(`^\\d+(\\.\\d{1,${decimalPlaces}})?$`);
  if (!pattern.test(value.toString())) {
    throw new BadRequestException(
      `${fieldName} deve ter no máximo ${decimalPlaces} casas decimais`,
    );
  }
};

/**
 * Validador para MongoDB ObjectId
 */
export const validateObjectId = (
  value: any,
  fieldName: string,
): void => {
  if (!value || typeof value !== 'string') {
    throw new BadRequestException(`${fieldName} deve ser uma string válida`);
  }

  // Validação básica de ObjectId MongoDB (24 caracteres hexadecimais)
  if (!/^[0-9a-fA-F]{24}$/.test(value)) {
    throw new BadRequestException(
      `${fieldName} deve ser um ID válido`,
    );
  }
};

/**
 * Validador principal para dados de Gastos
 */
export class GastosValidator {
  /**
   * Valida descrição do gasto
   */
  static validateDescricao(descricao: any, isUpdate: boolean = false): void {
    if (isUpdate && descricao === undefined) {
      return; // Campo opcional em atualizações
    }

    try {
      validateRequiredString(descricao, 'Descrição', 3, 255);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(VALIDATION_ERRORS.DESCRICAO.REQUIRED);
      }
      throw error;
    }
  }

  /**
   * Valida valor do gasto
   */
  static validateValor(valor: any, isUpdate: boolean = false): void {
    if (isUpdate && valor === undefined) {
      return; // Campo opcional em atualizações
    }

    validatePositiveNumber(valor, 'Valor', 0);
    validateNumberRange(valor, 'Valor', 0.01, 999999999.99);
    validateDecimalPlaces(valor, 'Valor', 2);
  }

  /**
   * Valida tipo de gasto ID
   */
  static validateTipoDeGastoId(
    tipoDeGastoId: any,
    isUpdate: boolean = false,
  ): void {
    if (isUpdate && tipoDeGastoId === undefined) {
      return; // Campo opcional em atualizações
    }

    try {
      validateObjectId(tipoDeGastoId, 'Tipo de Gasto');
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(VALIDATION_ERRORS.TIPO_GASTO_ID.REQUIRED);
      }
      throw error;
    }
  }

  /**
   * Valida todos os dados de gasto
   * @param dados Dados a validar
   * @param isUpdate Se é uma atualização (torna campos opcionais)
   */
  static validateAll(dados: Partial<Gastos>, isUpdate: boolean = false): void {
    if (!dados || Object.keys(dados).length === 0) {
      if (!isUpdate) {
        throw new BadRequestException('Nenhum dado fornecido para validação');
      }
      return;
    }

    this.validateDescricao(dados.descricao, isUpdate);
    this.validateValor(dados.valor, isUpdate);
    this.validateTipoDeGastoId(dados.tipoGastoId, isUpdate);
  }
}

/**
 * Hook para validação com regras customizadas
 */
export class GastosValidationBuilder {
  private rules: ValidationRule[] = [];

  addRule(field: string, validate: () => void): this {
    this.rules.push({ field, validate });
    return this;
  }

  validate(): void {
    for (const rule of this.rules) {
      try {
        rule.validate();
      } catch (error) {
        throw error;
      }
    }
  }
}
