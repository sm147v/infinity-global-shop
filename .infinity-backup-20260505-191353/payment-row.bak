"use client";

const methods = [
  { name: "Visa", svg: <svg viewBox="0 0 48 16" style={{ height: 18 }}><text x="0" y="14" fontFamily="Arial Black, sans-serif" fontSize="15" fontWeight="900" fill="#1A1F71" fontStyle="italic">VISA</text></svg> },
  { name: "Mastercard", svg: <svg viewBox="0 0 32 20" style={{ height: 22 }}><circle cx="12" cy="10" r="8" fill="#EB001B"/><circle cx="20" cy="10" r="8" fill="#F79E1B"/><path d="M16 4.5a8 8 0 0 1 0 11 8 8 0 0 1 0-11z" fill="#FF5F00"/></svg> },
  { name: "PSE", svg: <svg viewBox="0 0 36 14" style={{ height: 16 }}><text x="0" y="11" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="#0033A0">PSE</text></svg> },
  { name: "Nequi", svg: <svg viewBox="0 0 56 16" style={{ height: 16 }}><text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="800" fill="#FF0080" letterSpacing="-0.3">NEQUI</text></svg> },
  { name: "Bancolombia", svg: <svg viewBox="0 0 80 16" style={{ height: 16 }}><rect width="14" height="14" x="0" y="1" rx="2" fill="#FDDA24"/><text x="6" y="11" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="9" fontWeight="900" fill="#00205B">B</text><text x="18" y="12" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#00205B">Bancolombia</text></svg> },
  { name: "Wompi", svg: <svg viewBox="0 0 56 16" style={{ height: 14 }}><text x="0" y="12" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" fill="#3C46FF" letterSpacing="-0.3">wompi</text></svg> },
];

export function PaymentRow({ align = "center", showLabel = true }) {
  const justify = align === "start" ? "flex-start" : align === "end" ? "flex-end" : "center";
  return (
    <div className="payment-row-wrap" style={{ display: "flex", flexDirection: "column", gap: "0.6rem", alignItems: align === "center" ? "center" : align }}>
      {showLabel && (
        <span style={{ fontSize: "0.7rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(74, 79, 69, 0.55)" }}>
          Medios de pago
        </span>
      )}
      <ul style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center", justifyContent: justify, listStyle: "none", padding: 0, margin: 0 }}>
        {methods.map(m => (
          <li key={m.name} title={m.name} className="payment-logo" style={{ display: "inline-flex", alignItems: "center", opacity: 0.65, transition: "opacity 0.2s ease", cursor: "default" }}>
            {m.svg}
          </li>
        ))}
      </ul>
      <style>{`.payment-row-wrap .payment-logo:hover { opacity: 1; }`}</style>
    </div>
  );
}

export default PaymentRow;
