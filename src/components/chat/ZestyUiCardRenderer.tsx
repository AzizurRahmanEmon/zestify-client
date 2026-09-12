import MenuResultsCard from "@/components/chat/MenuResultsCard";
import ReservationConfirmationCard from "@/components/chat/ReservationConfirmationCard";
import type { ZestyUiCard } from "@/types/zestyChat";

interface Props {
  uiCard: ZestyUiCard;
}

const ZestyUiCardRenderer = ({ uiCard }: Props) => {
  if (uiCard.type === "reservation_confirmation") {
    return (
      <ReservationConfirmationCard
        reservationId={uiCard.data.reservationId}
        date={uiCard.data.date}
        time={uiCard.data.time}
        partySize={uiCard.data.partySize}
      />
    );
  }

  if (uiCard.type === "menu_results") {
    return <MenuResultsCard items={uiCard.data.items} />;
  }

  return null;
};

export default ZestyUiCardRenderer;
