type OrderPopupProps = {
  isOpen: boolean;
  seconds: number;
};

export function OrderPopup({ isOpen, seconds }: OrderPopupProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-3xl p-6 shadow-xl max-w-sm w-full text-center">
        <h3 className="text-xl font-bold mb-2">Thank you!</h3>
        <p className="text-gray-600 mb-4">
          Your order has been placed. We will call you shortly to confirm.
        </p>
        <p className="text-xs text-gray-500">Redirecting to home in {seconds} seconds…</p>
      </div>
    </div>
  );
}
