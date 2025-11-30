"use client";

export default function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold text-[#2E2E2E] mb-4">
          Confirm Logout
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to logout?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#C65D5D] text-white rounded hover:bg-[#a64b4b]"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
