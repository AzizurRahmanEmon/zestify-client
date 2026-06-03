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
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
        <h2 className="text-xl font-primary font-bold text-stone-900 mb-6">
          Account Settings
        </h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-zPink/20 focus:border-zPink transition-all duration-300 bg-[#f8f5f2]/50"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Email Address
              <span className="text-stone-400 font-normal ml-1.5">(Cannot be changed)</span>
            </label>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-3 border border-stone-100 rounded-xl bg-stone-50 text-stone-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-zPink/20 focus:border-zPink transition-all duration-300 bg-[#f8f5f2]/50"
            />
          </div>
          <button
            onClick={onSave}
            className="w-full bg-zPink text-white py-3.5 rounded-xl hover:bg-pink-700 transition-colors duration-300 font-semibold text-sm mt-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardSettings;
