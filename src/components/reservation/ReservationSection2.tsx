import ReservationForm from "@/components/form/ReservationForm";
import Image from "next/image";

const ReservationSection2 = () => {
  return (
    <section
      className="bg-no-repeat overflow-hidden"
      style={{
        backgroundImage: `url(/assets/img/hex-shapes.png)`,
      }}
    >
      <div className="ar-container py-20 lg:py-30">
        {/* Original Header Design */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <Image
              width={14}
              height={22}
              src="/assets/img/fire.png"
              alt="fire"
            />
            <h6 className="ar-subtitle">Reservation Details</h6>
          </div>
          <h2 className="ar-title mt-3">Book Your Reservation</h2>
        </div>

        {/* Main Content */}
        <div className="relative mt-10">
          <Image
            width={1370}
            height={700}
            src="/assets/img/reservation-bg-2.png"
            alt=""
            className="max-h-175 bg-cover z-10 top-1/2 -translate-y-1/2 left-0 absolute hidden lg:block"
          />

          {/* Form Container */}
          <div className="max-w-188.75 w-full lg:w-3/5 2xl:w-4/5 relative z-10 border border-gray-200 border-opacity-50">
            <div className="bg-white/95 backdrop-blur-sm py-8 px-5 xl:py-10 xl:px-8 shadow-xl">
              <ReservationForm />
              <div className="bg-zPink p-2 w-85 absolute top-47.5 -right-85 hidden lg:block">
                <div className="border border-dashed border-white px-8 py-5">
                  <Image
                    width={54}
                    height={54}
                    src="/assets/img/customer-service.png"
                    alt="icon"
                  />
                  <h6 className="font-medium text-white mt-5">
                    Call us for ony inquiry <br />( 484 ) 4987 989
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReservationSection2;
