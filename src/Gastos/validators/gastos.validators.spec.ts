import { BadRequestException } from '@nestjs/common';
import { GastosValidator, VALIDATION_ERRORS } from './gastos.validators';

describe('GastosValidator', () => {
  describe('validateDescricao', () => {
    it('deve validar descrição válida', () => {
      expect(() => {
        GastosValidator.validateDescricao('Aluguel Escritório');
      }).not.toThrow();
    });

    it('deve lançar erro para descrição vazia', () => {
      expect(() => {
        GastosValidator.validateDescricao('');
      }).toThrow(BadRequestException);
    });

    it('deve lançar erro para descrição muito curta', () => {
      expect(() => {
        GastosValidator.validateDescricao('AB');
      }).toThrow(BadRequestException);
    });

    it('deve lançar erro para descrição muito longa', () => {
      const longText = 'a'.repeat(256);
      expect(() => {
        GastosValidator.validateDescricao(longText);
      }).toThrow(BadRequestException);
    });

    it('deve lançar erro para tipo inválido', () => {
      expect(() => {
        GastosValidator.validateDescricao(123);
      }).toThrow(BadRequestException);
    });

    it('deve permitir null em atualização', () => {
      expect(() => {
        GastosValidator.validateDescricao(undefined, true);
      }).not.toThrow();
    });
  });

  describe('validateValor', () => {
    it('deve validar valor válido', () => {
      expect(() => {
        GastosValidator.validateValor(100.50);
      }).not.toThrow();
    });

    it('deve lançar erro para valor zero', () => {
      expect(() => {
        GastosValidator.validateValor(0);
      }).toThrow(BadRequestException);
    });

    it('deve lançar erro para valor negativo', () => {
      expect(() => {
        GastosValidator.validateValor(-50);
      }).toThrow(BadRequestException);
    });

    it('deve lançar erro para valor acima do máximo', () => {
      expect(() => {
        GastosValidator.validateValor(1000000000);
      }).toThrow(BadRequestException);
    });

    it('deve validar casas decimais', () => {
      expect(() => {
        GastosValidator.validateValor(100.999);
      }).toThrow(BadRequestException);
    });

    it('deve permitir undefined em atualização', () => {
      expect(() => {
        GastosValidator.validateValor(undefined, true);
      }).not.toThrow();
    });
  });

  describe('validateTipoDeGastoId', () => {
    it('deve validar ObjectId válido', () => {
      expect(() => {
        GastosValidator.validateTipoDeGastoId(
          '507f1f77bcf86cd799439011',
        );
      }).not.toThrow();
    });

    it('deve lançar erro para ObjectId inválido', () => {
      expect(() => {
        GastosValidator.validateTipoDeGastoId('invalid-id');
      }).toThrow(BadRequestException);
    });

    it('deve lançar erro para null', () => {
      expect(() => {
        GastosValidator.validateTipoDeGastoId(null);
      }).toThrow(BadRequestException);
    });

    it('deve permitir undefined em atualização', () => {
      expect(() => {
        GastosValidator.validateTipoDeGastoId(undefined, true);
      }).not.toThrow();
    });
  });

  describe('validateAll', () => {
    const validData = {
      descricao: 'Gasto Válido',
      valor: 150.75,
      tipoDeGastoId: '507f1f77bcf86cd799439011',
    };

    it('deve validar dados completos', () => {
      expect(() => {
        GastosValidator.validateAll(validData, false);
      }).not.toThrow();
    });

    it('deve validar dados parciais em atualização', () => {
      expect(() => {
        GastosValidator.validateAll(
          { descricao: 'Novo Gasto' },
          true,
        );
      }).not.toThrow();
    });

    it('deve exigir todos os campos em criação', () => {
      expect(() => {
        GastosValidator.validateAll(
          { descricao: 'Incompleto' },
          false,
        );
      }).toThrow(BadRequestException);
    });

    it('deve lançar erro com dados inválidos', () => {
      expect(() => {
        GastosValidator.validateAll(
          { ...validData, valor: -100 },
          false,
        );
      }).toThrow(BadRequestException);
    });

    it('deve lançar erro para dados vazios em criação', () => {
      expect(() => {
        GastosValidator.validateAll({}, false);
      }).toThrow(BadRequestException);
    });

    it('deve permitir dados vazios em atualização', () => {
      expect(() => {
        GastosValidator.validateAll({}, true);
      }).not.toThrow();
    });
  });

  describe('VALIDATION_ERRORS', () => {
    it('deve ter mensagens para descricao', () => {
      expect(VALIDATION_ERRORS.DESCRICAO.REQUIRED).toBeDefined();
      expect(VALIDATION_ERRORS.DESCRICAO.EMPTY).toBeDefined();
      expect(VALIDATION_ERRORS.DESCRICAO.TOO_SHORT).toBeDefined();
    });

    it('deve ter mensagens para valor', () => {
      expect(VALIDATION_ERRORS.VALOR.REQUIRED).toBeDefined();
      expect(VALIDATION_ERRORS.VALOR.INVALID_VALUE).toBeDefined();
      expect(VALIDATION_ERRORS.VALOR.DECIMAL_PLACES).toBeDefined();
    });

    it('deve ter mensagens para tipo de gasto', () => {
      expect(VALIDATION_ERRORS.TIPO_GASTO_ID.REQUIRED).toBeDefined();
      expect(VALIDATION_ERRORS.TIPO_GASTO_ID.INVALID_FORMAT).toBeDefined();
    });
  });
});
