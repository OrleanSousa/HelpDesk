import { FaEye, FaHeart, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import StatusContainer from './StatusContainer';

const Homepage = () => {
  const stats = {
    aberto: { title: 'Abertos', count: 10 },
    em_atendimento: { title: 'Em Atendimento', count: 5 },
    encerrado: { title: 'Encerrados', count: 8 },
    total: { title: 'Total', count: 23 },
  };

  const posts = [
    {
      titulo: 'Ipsam magnam pariatur distincto architecto facere sapiente non.',
      categoria: 'Educação',
      views: 725,
      likes: 159,
      id: 522251,
      tipo: 'COLUNA',
      publicado: '07/05/25 21:44',
      alterado: '07/05/25 21:44',
    },
    {
      titulo: 'Quisquam ut perspiciatis laborum.',
      categoria: 'Estética',
      views: 87021,
      likes: 8814,
      id: 147391,
      tipo: 'BLOG',
      publicado: '07/05/25 21:44',
      alterado: '07/05/25 21:44',
    },
  ];

  return (
    <div className="h-full bg-gray-800 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Listagem de Posts</h2>

        {/* Cards de estatísticas */}
        <StatusContainer stats={stats} />

        {/* Filtros e botão novo */}
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <select className="bg-gray-800 text-white p-2 border border-gray-600 rounded focus:outline-none focus:border-blue-500">
              <option>Selecione uma categoria</option>
            </select>
            <select className="bg-gray-800 text-white p-2 border border-gray-600 rounded focus:outline-none focus:border-blue-500">
              <option>Selecione um tipo de post</option>
            </select>
            <button className="ml-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors">
              <FaPlus /> Novo
            </button>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800 text-gray-200">
              <tr>
                <th className="p-3 text-left">Título</th>
                <th className="p-3 text-left">Categoria</th>
                <th className="p-3 text-center"><FaEye /></th>
                <th className="p-3 text-center"><FaHeart /></th>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Tipo</th>
                <th className="p-3 text-left">Publicado</th>
                <th className="p-3 text-left">Última alteração</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {posts.map((post, idx) => (
                <tr key={idx} className="hover:bg-gray-600 transition-colors">
                  <td className="p-3">{post.titulo}</td>
                  <td className="p-3">{post.categoria}</td>
                  <td className="p-3 text-center">{post.views}</td>
                  <td className="p-3 text-center">{post.likes}</td>
                  <td className="p-3">{post.id}</td>
                  <td className="p-3">{post.tipo}</td>
                  <td className="p-3">{post.publicado}</td>
                  <td className="p-3">{post.alterado}</td>
                  <td className="p-3">
                    <div className="flex justify-center gap-2">
                      <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors">
                        <FaEye />
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors">
                        <FaEdit />
                      </button>
                      <button className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Homepage;