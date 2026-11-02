import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database/sequelize";

export class User extends Model {
  declare id: number;
  declare nome: string;
  declare email: string;
  declare cpf: string;
  declare password: string;

  // Nunca devolve a senha nas respostas
  public convertToResponse(): { id: number; nome: string; email: string; cpf: string } {
    return { id: this.id, nome: this.nome, email: this.email, cpf: this.cpf };
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
    nome: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    cpf: { type: DataTypes.STRING(11), allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  },
);
