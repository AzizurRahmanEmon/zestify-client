"use client";

interface UserDashboardDeleteAddressModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const UserDashboardDeleteAddressModal = ({
  open,
  onCancel,
  onConfirm,
}: UserDashboardDeleteAddressModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-150 transition-opacity"
        onClick={onCancel}
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-2xl shadow-2xl z-160 overflow-hidden p-8 text-center">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
          <i className="fa-solid fa-trash-can"></i>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Address?</h3>
        <p className="text-gray-600 mb-8">
          Are you sure you want to delete this address? This action cannot be
          undone.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onCancel}
            className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-3 px-6 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDashboardDeleteAddressModal;
