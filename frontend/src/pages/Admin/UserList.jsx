import { useEffect, useState } from "react";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
} from "../../redux/api/usersApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";


const UserList = () => {
  const { data: users, refetch, isLoading, error } = useGetUsersQuery();

  const [deleteUser] = useDeleteUserMutation();

  const [editableUserId, setEditableUserId] = useState(null);
  const [editableUserName, setEditableUserName] = useState("");
  const [editableUserEmail, setEditableUserEmail] = useState("");

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const toggleEdit = (id, username, email) => {
    setEditableUserId(id);
    setEditableUserName(username);
    setEditableUserEmail(email);
  };

  const updateHandler = async (id) => {
    try {
      await updateUser({
        userId: id,
        username: editableUserName,
        email: editableUserEmail,
      });
      setEditableUserId(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
  <div className="p-2 md:p-4 min-h-screen user-list-section">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.error}
        </Message>
      ) : (
       
    <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="mb-8 sm:mb-0">
        <AdminMenu />
        </div>
      <div className="md:w-full overflow-x-auto"> 
        <div className="w-full max-w-full md:max-w-4xl mx-auto mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
                👥 Manage Users
              </h1>
              <p className="text-gray-400 mt-1">Manage user accounts and permissions</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-400">Total Users: </span>
                <span className="text-pink-400 font-bold">{users?.length || 0}</span>
              </div>
              <div className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                <span className="text-sm text-gray-400">Admins: </span>
                <span className="text-green-400 font-bold">{users?.filter(u => u.isAdmin).length || 0}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 h-0.5 bg-gradient-to-r from-pink-600 to-purple-600"></div>
        </div>
       <div className="max-w-full md:max-w-4xl mx-auto bg-gray-900 p-2 md:p-4 rounded-xl shadow-2xl 
       border border-gray-800 overflow-x-auto">
        <table className="w-full min-w-[650px] border-collapse">
          <thead className="bg-gray-800/70">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase text-pink-400 tracking-wider w-20 user-id-col">
                🆔 User ID
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase text-pink-400 tracking-wider w-40">
                👤 Name
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold uppercase text-pink-400 tracking-wider w-60">
                📧 Email
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase text-pink-400 tracking-wider w-24">
                🛡️ Admin
              </th>
              <th className="px-4 py-4 text-center text-xs font-bold uppercase text-pink-400 tracking-wider w-32">
                ⚙️ Actions
              </th>
            </tr>
          </thead>
           <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-b border-gray-700/50 hover:bg-gray-800/70 hover:shadow-lg 
                 transition-all duration-200 text-white group border-l-4 border-l-transparent 
                 hover:border-l-pink-500"
              >
              <td className="px-4 py-4 whitespace-nowrap user-id-col">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full
                   flex items-center justify-center text-white text-sm font-bold mr-3">
                    {user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <span className="text-gray-400 text-sm font-mono">
                    {user._id.substring(0, 8)}...
                  </span>
                </div>
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {editableUserId === user._id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={editableUserName}
                      onChange={(e) => setEditableUserName(e.target.value)}
                      className="flex-1 p-2 bg-gray-700 text-white border border-pink-500 
                      rounded-lg outline-none focus:border-pink-400 transition"
                    />
                    <button
                      onClick={() => updateHandler(user._id)}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
                    >
                      <FaCheck />
                    </button>
                  </div>
                  ) : (
                    <div className="flex items-center justify-between group">
                      <span className="font-semibold text-white">{user.username || user.name}</span>
                      <button
                        onClick={() => toggleEdit(user._id, user.username || user.name, user.email)}
                        className="opacity-0 group-hover:opacity-100 text-pink-500 hover:text-pink-400 
                        p-1 rounded transition-all duration-200"
                      >
                        <FaEdit size={14} />
                      </button>
                    </div>
                  )}
              </td>
              <td className="px-4 py-4 whitespace-nowrap">
                {editableUserId === user._id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={editableUserEmail}
                      onChange={(e) => setEditableUserEmail(e.target.value)}
                      className="flex-1 p-2 bg-gray-700 text-white border border-pink-500 rounded-lg outline-none 
                      focus:border-pink-400 transition"
                    />
                    <button
                      onClick={() => updateHandler(user._id)}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
                    >
                      <FaCheck />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between group">
                    <a
                      href={`mailto:${user.email}`}
                      className="text-gray-300 hover:text-blue-400 transition duration-150 flex items-center gap-2"
                    >
                      📧 {user.email}
                    </a>
                    <button
                      onClick={() => toggleEdit(user._id, user.username || user.name, user.email)}
                      className="opacity-0 group-hover:opacity-100 text-pink-500 hover:text-pink-400 
                      p-1 rounded transition-all duration-200"
                    >
                      <FaEdit size={14} />
                    </button>
                  </div>
                )}
              </td>
              <td className="px-4 py-4 text-center">
                {user.isAdmin ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                  bg-green-100 text-green-800 border border-green-300">
                    👑 Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                   bg-gray-100 text-gray-800 border border-gray-300">
                    👤 User
                  </span>
                )}
              </td>
              <td className="px-4 py-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  {!user.isAdmin ? (
                    <button
                      onClick={() => deleteHandler(user._id)}
                      className="bg-red-600 text-white p-2.5 rounded-lg hover:bg-red-700 transform
                       hover:scale-105 transition-all duration-200 shadow-md group"
                      title="Delete User"
                    >
                      <FaTrash size={14} className="group-hover:animate-bounce" />
                    </button>
                  ) : (
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-lg">
                      <span className="text-gray-500 text-xs">🛡️</span>
                    </div>
                  )}
                </div>
              </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default UserList;