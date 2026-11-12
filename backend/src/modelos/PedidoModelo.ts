import { DataTypes, Model } from 'sequelize';
import type { CreationOptional, InferAttributes, InferCreationAttributes, NonAttribute } from 'sequelize';
import { sequelize } from '../config/banco';
import type { ClienteModelo } from './ClienteModelo';
import type { ProdutoModelo } from './ProdutoModelo';

export class PedidoModelo extends Model<InferAttributes<PedidoModelo>, InferCreationAttributes<PedidoModelo>> {
  declare id: CreationOptional<number>;
  declare clienteId: number;
  declare produtoId: number;
  declare quantidade: number;
  declare valorUnitario: number;
  declare custoUnitario: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare cliente?: NonAttribute<ClienteModelo>;
  declare produto?: NonAttribute<ProdutoModelo>;
}

PedidoModelo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    clienteId: { type: DataTypes.INTEGER, allowNull: false },
    produtoId: { type: DataTypes.INTEGER, allowNull: false },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    valorUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    custoUnitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize, tableName: 'pedidos' }
);
