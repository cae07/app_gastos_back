import { Document } from 'mongoose';

export interface IMediaModel extends Document {
  nome: string;
  sigla: string;
  ativa: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class MedidaModel {
  nome!: string;
  sigla!: string;
  ativa!: boolean;
}
