"use client";

import UserDashboardSidebar from "@/components/user/UserDashboardSidebar";
import UserDashboardOverview from "@/components/user/UserDashboardOverview";
import UserDashboardOrders from "@/components/user/UserDashboardOrders";
import UserDashboardFavorites from "@/components/user/UserDashboardFavorites";
import UserDashboardAddresses from "@/components/user/UserDashboardAddresses";
import UserDashboardSettings from "@/components/user/UserDashboardSettings";
import UserDashboardOrderDetailsModal from "@/components/user/UserDashboardOrderDetailsModal";
import UserDashboardAddressModal from "@/components/user/UserDashboardAddressModal";
import UserDashboardDeleteAddressModal from "@/components/user/UserDashboardDeleteAddressModal";
import useUserDashboard from "@/hooks/useUserDashboard";

const UserDashboardView = () => {
  const {
    activeTab,
    loading,
    customer,
    stats,
    orders,
    selectedOrder,
    isOrderModalOpen,
    addresses,
    isAddressModalOpen,
    isDeleteModalOpen,
    editingAddress,
    addressForm,
    favorites,
    name,
    email,
    phone,
    loyaltyPoints,
    displayInitial,
    setActiveTab,
    handleLogout,
    handleViewAllOrders,
    handleViewFavorites,
    openOrderDetails,
    openAddAddressModal,
    openEditAddressModal,
    openDeleteModal,
    handleSaveProfile,
    handleAddOrUpdateAddress,
    handleDeleteAddress,
    setIsOrderModalOpen,
    setIsAddressModalOpen,
    setIsDeleteModalOpen,
    handleAddressLabelChange,
    handleAddressAddressChange,
    handleAddressCountryChange,
    handleAddressStateChange,
    handleAddressCityChange,
    handleAddressZipCodeChange,
    handleAddressDefaultChange,
    setName,
    setPhone,
  } = useUserDashboard();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-zPink border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <UserDashboardOrderDetailsModal
        open={isOrderModalOpen}
        order={selectedOrder}
        onClose={() => setIsOrderModalOpen(false)}
      />

      <UserDashboardAddressModal
        open={isAddressModalOpen}
        editingAddress={editingAddress}
        addressForm={addressForm}
        onClose={() => setIsAddressModalOpen(false)}
        onSubmit={(e) => {
          void handleAddOrUpdateAddress(e);
        }}
        onLabelChange={handleAddressLabelChange}
        onAddressChange={handleAddressAddressChange}
        onCountryChange={handleAddressCountryChange}
        onStateChange={handleAddressStateChange}
        onCityChange={handleAddressCityChange}
        onZipCodeChange={handleAddressZipCodeChange}
        onDefaultChange={handleAddressDefaultChange}
      />

      <UserDashboardDeleteAddressModal
        open={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          void handleDeleteAddress();
        }}
      />

      <div className="ar-container py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <UserDashboardSidebar
              activeTab={activeTab}
              customerName={customer?.name}
              customerEmail={customer?.email}
              displayInitial={displayInitial}
              loyaltyPoints={loyaltyPoints}
              onTabChange={setActiveTab}
              onLogout={handleLogout}
            />
          </div>

          <div className="lg:col-span-9">
            {activeTab === "overview" && (
              <UserDashboardOverview
                stats={stats}
                loyaltyPoints={loyaltyPoints}
                orders={orders}
                onViewAllOrders={handleViewAllOrders}
                onViewFavorites={handleViewFavorites}
                onOpenOrderDetails={openOrderDetails}
              />
            )}

            {activeTab === "orders" && (
              <UserDashboardOrders
                orders={orders}
                onOpenOrderDetails={openOrderDetails}
              />
            )}

            {activeTab === "favorites" && (
              <UserDashboardFavorites favorites={favorites} />
            )}

            {activeTab === "addresses" && (
              <UserDashboardAddresses
                addresses={addresses}
                onAddNew={openAddAddressModal}
                onEditAddress={openEditAddressModal}
                onDeleteAddress={openDeleteModal}
              />
            )}

            {activeTab === "settings" && (
              <UserDashboardSettings
                name={name}
                email={email}
                phone={phone}
                onNameChange={setName}
                onPhoneChange={setPhone}
                onSave={() => {
                  void handleSaveProfile();
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardView;
