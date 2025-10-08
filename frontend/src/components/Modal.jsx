const Modal = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-80"
           onClick={onClose}></div>
          <div className="relative bg-gray-900 max-w-lg w-full mx-4 
                       p-6 rounded-xl shadow-2xl border-2 border-pink-700/50 
                       z-10 text-right">
            <button
              className="text-pink-500 text-xl font-bold 
                hover:text-pink-400 focus:outline-none absolute top-3 left-4"
              onClick={onClose}
            >
               &times;
            </button>
            <div className="pt-8">
               {children}
            </div>
           
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;