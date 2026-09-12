interface Props {
  reservationId: string;
  date: string;
  time: string;
  partySize: number;
}

function formatReservationDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }

  return parsed.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(time: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!match) {
    return time;
  }

  const hours = Number(match[1]);
  const minutes = match[2];
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

const ReservationConfirmationCard = ({
  reservationId,
  date,
  time,
  partySize,
}: Props) => {
  const guestLabel = partySize === 1 ? "1 guest" : `${partySize} guests`;

  return (
    <div
      className="mt-3 rounded-2xl border border-green-200 bg-green-50 p-4 shadow-sm"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
          <svg
            className="h-5 w-5"
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
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-base font-bold text-green-900">
            Reservation confirmed!
          </p>
          <p className="mt-1 text-sm text-green-800">
            You&apos;re all set. We look forward to seeing you.
          </p>

          <dl className="mt-4 grid gap-2 text-sm text-green-900">
            <div className="flex justify-between gap-4">
              <dt className="font-medium text-green-800">Date</dt>
              <dd className="text-right">{formatReservationDate(date)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium text-green-800">Time</dt>
              <dd className="text-right">{formatTime(time)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="font-medium text-green-800">Party size</dt>
              <dd className="text-right">{guestLabel}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-green-200 pt-2">
              <dt className="font-medium text-green-800">Confirmation</dt>
              <dd className="truncate text-right font-mono text-xs">
                {reservationId}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ReservationConfirmationCard;
