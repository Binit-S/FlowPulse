import { FoodStall } from "@/types";
import { useState } from "react";
import { X } from "lucide-react";

interface OrderModalProps {
  stall: FoodStall | null;
  onClose: () => void;
}

export function OrderModal({ stall, onClose }: OrderModalProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [ordered, setOrdered] = useState(false);

  if (!stall) return null;

  const total = stall.menuItems.reduce((acc, item) => {
    return acc + (quantities[item.id] || 0) * item.price;
  }, 0);

  const handleOrder = () => {
    setOrdered(true);
    setTimeout(() => {
      onClose();
      setOrdered(false);
      setQuantities({});
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-bg0/80 backdrop-blur-md p-safe"
         role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="bg-bg1 w-full max-w-md rounded-t-[32px] sm:rounded-[32px] border-none overflow-hidden animate-fade-slide-up flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-6 relative flex shrink-0 items-center">
          <div className="text-4xl mr-4" aria-hidden="true">{stall.emoji}</div>
          <div>
            <h3 id="modal-title" className="font-heading font-bold text-[20px] tracking-tight">{stall.name}</h3>
            <p className="text-[14px] text-orange font-body font-bold mt-1">Wait: ~{stall.waitMinutes} m</p>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-bg2 rounded-full text-fg2 hover:text-fg0 transition-all active:scale-[0.97]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {ordered ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="w-16 h-16 rounded-full bg-green text-bg0 flex items-center justify-center text-3xl mb-6">
                ✓
              </div>
              <h4 className="font-heading font-bold text-xl mb-2">Order Confirmed!</h4>
              <p className="text-[15px] text-fg2 font-body text-center leading-relaxed">
                Estimated pickup in {stall.waitMinutes} mins.<br/>
                We&apos;ll notify you when it&apos;s ready.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-[12px] text-fg2 uppercase tracking-wide font-heading font-bold">
                Menu Items
              </p>
              {stall.menuItems.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <h5 className="font-heading font-medium text-[16px]">{item.name}</h5>
                    <p className="text-[14px] text-fg2 font-body mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button 
                      className="w-10 h-10 rounded-full bg-bg2 text-fg0 font-bold transition-all active:scale-[0.8]"
                      onClick={() => setQuantities(prev => ({ ...prev, [item.id]: Math.max(0, (prev[item.id] || 0) - 1) }))}
                    >
                      -
                    </button>
                    <span className="font-body font-bold w-4 text-center">{quantities[item.id] || 0}</span>
                    <button 
                      className="w-10 h-10 rounded-full bg-bg2 text-fg0 font-bold transition-all active:scale-[0.8]"
                      onClick={() => setQuantities(prev => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }))}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!ordered && (
          <div className="p-6 shrink-0 bg-bg1">
            <button
              onClick={handleOrder}
              disabled={total === 0}
              className={`w-full py-4 rounded-pill font-heading font-bold text-[16px] transition-all active:scale-[0.97] ${
                total > 0 ? "bg-orange text-[var(--bg0)]" : "bg-bg2 text-fg2 opacity-50"
              }`}
            >
              {total > 0 ? `Pay ₹${total}` : "Add items to order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
