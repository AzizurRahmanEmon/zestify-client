"use client";

interface UserDashboardSettingsProps {
  name: string;
  email: string;
  phone: string;
  onNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onSave: () => void;
}

const UserDashboardSettings = ({
  name,
  email,
  phone,
  onNameChange,
  onPhoneChange,
  onSave,
}: UserDashboardSettingsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Account Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address (Cannot be changed)
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zPink focus:border-transparent transition-all duration-300"
            />
          </div>
          <button
            onClick={onSave}
            className="w-full bg-zPink text-white py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300 font-medium"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardSettings;
