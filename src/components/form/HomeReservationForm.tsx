"use client";
import { useReservationForm } from "@/hooks/useReservationForm";
import DatePicker from "./DatePicker";
import HomeReservationActions from "./HomeReservationActions";

const HomeReservationForm = () => {
  const {
    alert,
    availableTimes,
    currentCustomer,
    formData,
    handleInputChange,
    handleSubmit,
    isLoadingSlots,
    isSubmitting,
    today,
  } = useReservationForm({ requireTerms: true });

  return (
    <div className="space-y-8">
      {alert && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            alert.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
          role="alert"
          aria-live="assertive"
        >
          {alert.type === "success" && (
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {alert.type === "danger" && (
            <svg
              className="w-5 h-5 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          )}
          <span>{alert.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={isSubmitting}
            className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 placeholder-transparent transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Full Name"
            required
          />
          <label
            htmlFor="name"
            className="absolute left-4 top-4 text-gray-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zPink"
          >
            Full Name *
          </label>
        </div>

        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            readOnly={!!currentCustomer?.token}
            disabled={isSubmitting}
            className={`peer w-full h-16 px-4 pt-6 pb-2 border-2 border-gray-600 rounded-xl placeholder-transparent transition-all duration-300 disabled:opacity-50 ${
              currentCustomer?.token
                ? "bg-gray-700/50 text-gray-300 focus:outline-none cursor-not-allowed"
                : "bg-transparent text-gray-100 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80"
            }`}
            placeholder="Email Address"
            required
            title={
              currentCustomer?.token
                ? "Your registered email (cannot be changed)"
                : "Enter your email address"
            }
          />
          <label
            htmlFor="email"
            className="absolute left-4 top-4 text-gray-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zPink"
          >
            Email Address *
          </label>
        </div>
      </div>

      <div className="relative">
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          disabled={isSubmitting}
          className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 placeholder-transparent transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Phone Number"
          required
        />
        <label
          htmlFor="phone"
          className="absolute left-4 top-4 text-gray-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zPink"
        >
          Phone Number *
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative">
          <DatePicker
            id="date"
            name="date"
            value={formData.date}
            onChange={(value) => handleInputChange("date", value)}
            disabled={isSubmitting}
            min={today}
            placeholder="Select Date"
            className="text-start w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            transparentBg
          />
          <label
            htmlFor="date"
            className="absolute left-4 top-2 text-xs text-zPink transition-all duration-300 pointer-events-none"
          >
            Reservation Date *
          </label>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-6 h-6 text-gray-100"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zM4 8h12v8H4V8z" />
            </svg>
          </div>
        </div>

        <div className="relative">
          {availableTimes.length > 0 ? (
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              disabled={isSubmitting || isLoadingSlots}
              className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              required
            >
              <option value="" disabled className="bg-gray-800 text-gray-300">
                {isLoadingSlots ? "Loading..." : "Select Time"}
              </option>
              {availableTimes.map((t) => (
                <option key={t} value={t} className="bg-gray-800 text-white">
                  {t}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="time"
              id="time"
              name="time"
              min="09:00"
              max="22:00"
              value={formData.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              disabled={isSubmitting || isLoadingSlots}
              className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 disabled:opacity-50 disabled:cursor-not-allowed"
              required
            />
          )}
          <label
            htmlFor="time"
            className="absolute left-4 top-2 text-xs text-zPink transition-all duration-300 pointer-events-none"
          >
            Time *
          </label>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-6 h-6 text-gray-100"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative">
        <select
          id="guests"
          name="guests"
          value={formData.guests}
          onChange={(e) => handleInputChange("guests", e.target.value)}
          disabled={isSubmitting}
          className="peer w-full h-16 px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          required
        >
          <option value="" disabled className="bg-gray-800 text-gray-300">
            Select number of guests
          </option>
          <option value="1" className="bg-gray-800 text-white">
            1 Person
          </option>
          <option value="2" className="bg-gray-800 text-white">
            2 People
          </option>
          <option value="3" className="bg-gray-800 text-white">
            3 People
          </option>
          <option value="4" className="bg-gray-800 text-white">
            4 People
          </option>
          <option value="5+" className="bg-gray-800 text-white">
            5+ People
          </option>
        </select>
        <label
          htmlFor="guests"
          className="absolute left-4 top-2 text-xs text-zPink transition-all duration-300 pointer-events-none"
        >
          Number of Guests *
        </label>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-100 transform transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      <div className="relative">
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          disabled={isSubmitting}
          className="peer w-full px-4 pt-6 pb-2 bg-transparent border-2 border-gray-600 rounded-xl text-gray-100 placeholder-transparent transition-all duration-300 focus:border-zPink focus:outline-none hover:border-zPink focus:ring-1 focus:ring-zPink/80 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
          placeholder="Special Requests"
        ></textarea>
        <label
          htmlFor="message"
          className="absolute left-4 top-4 text-gray-400 transition-all duration-300 pointer-events-none peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-zPink peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-zPink"
        >
          Special Requests (Optional)
        </label>
      </div>

      <HomeReservationActions
        formData={{ terms: formData.terms, marketing: formData.marketing }}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default HomeReservationForm;
