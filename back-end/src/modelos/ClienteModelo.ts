import { DataTypes, Model } from 'sequelize';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/banco';

export class ClienteModelo extends Model<InferAttributes<ClienteModelo>, InferCreationAttributes<ClienteModelo>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare email: string;
  declare telefone: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ClienteModelo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    telefone: { type: DataTypes.STRING(20), allowNull: false, defaultValue: '' },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'clientes' }
);
