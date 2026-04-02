import { useCustomContext } from "@/context/context";
interface Props {
  isVideoModalOpen: boolean;
  closeVideoModal: () => void;
}
const VideoModal = ({ isVideoModalOpen, closeVideoModal }: Props) => {
  const { currentVideoUrl } = useCustomContext();
  const src =
    currentVideoUrl ||
    "https://www.youtube.com/embed/mK3cGscQRU8?si=vJv9I00dypOOMw9e";
  return (
    <>
      <div
        className={`ar-modal-overlay ${isVideoModalOpen ? "show" : "hide"}`}
        id="videoModalOverlay"
        aria-hidden="true"
        onClick={closeVideoModal}
      ></div>
      <div
        className={`ar-modal-body ${isVideoModalOpen ? "show" : "hide"}`}
        id="videoModalBody"
      >
        {isVideoModalOpen && (
          <div className="h-75 xl:h-137.5 lg:h-110 md:h-96">
            <iframe
              src={src}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="xl:h-137.5 lg:h-110 md:h-96 h-75 w-full rounded-xl"
              id="videoIframe"
            ></iframe>
            <button
              onClick={closeVideoModal}
              className="bg-[#ee5740] h-8 w-8 md:h-11 rounded-xl absolute md:w-11 -right-2 md:-right-5 -top-5 z-10 text-white flex items-center justify-center text-lg md:text-2xl cursor-pointer"
              id="closeVideoModalButton"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default VideoModal;
