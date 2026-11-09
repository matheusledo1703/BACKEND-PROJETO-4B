import { DataTypes, Model } from 'sequelize';
import type { CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import { sequelize } from '../config/banco';

export class CategoriaModelo extends Model<InferAttributes<CategoriaModelo>, InferCreationAttributes<CategoriaModelo>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

CategoriaModelo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(80), allowNull: false, unique: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'categorias' }
);
