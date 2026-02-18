import AccountBreadcrumb from "@/components/AccountBreadcrumb";
import LuxeyCTA from "@/components/LuxeyCTA";
import ProfitProfileManager from "@/components/ProfitProfileManager";

export const metadata = { title: "Profile | Luxey© MyAccount" };

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto w-full py-6 px-6">
            {/* BREADCRUMB */}
            <div className="mb-4">
                <AccountBreadcrumb page="Profile" />
            </div>

            <div className="bg-white border border-[#E4E4E4] rounded-lg overflow-hidden shadow-sm">
                {/* Header */}
                <div className="p-6 border-b border-[#F5F5F5]">
                    <h2 className="font-serif text-3xl text-black leading-none mb-1 tracking-tight uppercase">
                        Profile Information
                    </h2>
                    <p className="text-xs text-gray-400 font-semibold tracking-tight uppercase">
                        Update your contact and return address details.
                    </p>
                </div>

                {/* Form */}
                <div className="px-8 py-6 space-y-6">
                    {/* Contact Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        <div className="space-y-1">
                            <label className="form-label">First Name</label>
                            <input type="text" className="form-input" defaultValue="Jerrold" />
                        </div>
                        <div className="space-y-1">
                            <label className="form-label">Last Name</label>
                            <input type="text" className="form-input" defaultValue="Gardner" />
                        </div>
                        <div className="space-y-1">
                            <label className="form-label">Phone Number</label>
                            <input type="tel" className="form-input" defaultValue="8018796505" />
                        </div>
                        <div className="space-y-1">
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" defaultValue="jerrold@luxey.com" />
                        </div>
                    </div>

                    <div className="h-px bg-[#F5F5F5]" />

                    {/* Address Section */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-xl tracking-tight uppercase">
                            Return Shipping Address
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-4">
                            <div className="md:col-span-4 space-y-1">
                                <label className="form-label">Street Address</label>
                                <input type="text" className="form-input" defaultValue="10114 Grouse Creek Circle" />
                            </div>
                            <div className="md:col-span-2 space-y-1">
                                <label className="form-label">City</label>
                                <input type="text" className="form-input" defaultValue="Sandy" />
                            </div>
                            <div className="space-y-1">
                                <label className="form-label">State</label>
                                <input type="text" className="form-input" defaultValue="UT" />
                            </div>
                            <div className="space-y-1">
                                <label className="form-label">Zip</label>
                                <input type="text" className="form-input" defaultValue="84092" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="bg-[#FAFAFA] p-6 border-t border-[#E4E4E4] flex justify-end">
                    <LuxeyCTA>SAVE CHANGES</LuxeyCTA>
                </div>
            </div>

            {/* Profit Profiles */}
            <ProfitProfileManager />
        </div>
    );
}

