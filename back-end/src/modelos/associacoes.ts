import { CategoriaModelo } from './CategoriaModelo';
import { ClienteModelo } from './ClienteModelo';
import { PedidoModelo } from './PedidoModelo';
import { ProdutoModelo } from './ProdutoModelo';

CategoriaModelo.hasMany(ProdutoModelo, { foreignKey: 'categoriaId', as: 'produtos', onDelete: 'RESTRICT' });
ProdutoModelo.belongsTo(CategoriaModelo, { foreignKey: 'categoriaId', as: 'categoria', onDelete: 'RESTRICT' });

ClienteModelo.hasMany(PedidoModelo, { foreignKey: 'clienteId', as: 'pedidos', onDelete: 'RESTRICT' });
PedidoModelo.belongsTo(ClienteModelo, { foreignKey: 'clienteId', as: 'cliente', onDelete: 'RESTRICT' });

ProdutoModelo.hasMany(PedidoModelo, { foreignKey: 'produtoId', as: 'pedidos', onDelete: 'RESTRICT' });
PedidoModelo.belongsTo(ProdutoModelo, { foreignKey: 'produtoId', as: 'produto', onDelete: 'RESTRICT' });
