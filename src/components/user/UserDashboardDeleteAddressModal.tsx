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
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:max-w-sm max-w-[95%] bg-white rounded-2xl shadow-2xl z-160 overflow-hidden p-8 text-center border border-stone-100">
        <div className="w-16 h-16 bg-red-50 border border-red-100 text-red-500 rounded-full flex items-center justify-center text-2xl mx-auto mb-5">
          <i className="fa-solid fa-trash-can"></i>
        </div>
        <h3 className="text-xl font-primary font-bold text-stone-900 mb-2">Delete Address?</h3>
        <p className="text-stone-500 text-sm mb-7">
          Are you sure you want to delete this address? This action cannot be
          undone.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="py-3 px-5 bg-stone-100 text-stone-700 rounded-xl font-semibold text-sm hover:bg-stone-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-3 px-5 bg-red-500 text-white rounded-xl font-semibold text-sm hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default UserDashboardDeleteAddressModal;
