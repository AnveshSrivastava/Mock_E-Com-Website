import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReceiptModal({ receipt, onClose }) {
  const navigate = useNavigate();

  if (!receipt) return null;

  const handleContinueShopping = () => {
    onClose();
    navigate("/");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>🎉 Order Successful!</h2>
          <p>Thank you for your purchase.</p>
        </div>

        <div className="modal-body">
          <div className="modal-row">
            <span>Receipt ID:</span>
            <span className="mono">{receipt.receiptId || receipt.id}</span>
          </div>
          <div className="modal-row">
            <span>Total Amount:</span>
            <span className="bold">₹{receipt.total}</span>
          </div>
          <div className="modal-row">
            <span>Date & Time:</span>
            <span>
              {new Date(receipt.timestamp).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={handleContinueShopping}>Continue Shopping</button>
          <button onClick={onClose} className="btn-outline">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
