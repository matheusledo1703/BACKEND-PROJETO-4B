import { DataTypes, Model } from 'sequelize';
import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import { sequelize } from '../config/banco';
import type { CategoriaModelo } from './CategoriaModelo';

export class ProdutoModelo extends Model<InferAttributes<ProdutoModelo>, InferCreationAttributes<ProdutoModelo>> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare descricao: string;
  declare preco: number;
  declare categoriaId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare categoria?: NonAttribute<CategoriaModelo>;
}

ProdutoModelo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    descricao: { type: DataTypes.STRING(255), allowNull: false, defaultValue: '' },
    preco: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    categoriaId: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'produtos' }
);
