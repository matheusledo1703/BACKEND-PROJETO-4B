import { DataTypes, Model } from 'sequelize';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import type { Papel } from '@logica/entidades';
import { sequelize } from '../config/banco';

export class UsuarioModelo extends Model<InferAttributes<UsuarioModelo>, InferCreationAttributes<UsuarioModelo>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare email: string;
  declare cpf: string;
  declare senhaHash: string;
  declare papel: CreationOptional<Papel>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

UsuarioModelo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    cpf: { type: DataTypes.CHAR(11), allowNull: false, unique: true },
    senhaHash: { type: DataTypes.STRING(100), allowNull: false },
    papel: { type: DataTypes.STRING(10), allowNull: false, defaultValue: 'cliente' },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'usuarios' }
);
