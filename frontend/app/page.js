"use client";

import { VoucherCard } from "@/components/VoucherCard";
import { useJobCatalog, useVouchers } from "@/lib/useVouchers";
import { CONTRACT_ADDRESS } from "@/lib/contract";

export default function MarketplacePage() {
  const { vouchers, initialLoading, refreshing, error, refresh } = useVouchers();
  const { jobs, refreshJobs } = useJobCatalog();

  const reload = () => {
    refresh();
    refreshJobs();
  };

  return (
    <>
      <div className="page-head">
        <p className="page-head__eyebrow">NodeBridge</p>
        <h1 className="page-head__title">Open compute jobs</h1>
        <p className="page-head__lede">
          Fund a provider. Escrow holds the ETH until an admin accepts a result that matches the committed spec.
        </p>
      </div>

      {!CONTRACT_ADDRESS && <p className="form-error">Contract address is not configured.</p>}

      <div className="section-head">
        <p className="section-head__count">
          {vouchers.length} jobs{refreshing ? " · syncing" : ""}
        </p>
        <button onClick={reload} className="link-btn">
          Refresh
        </button>
      </div>

      {initialLoading && (
        <div className="voucher-grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="voucher-card voucher-card--skeleton" aria-hidden="true" />
          ))}
        </div>
      )}

      {error && <p className="form-error">{error}</p>}

      {!initialLoading && vouchers.length === 0 && !error && (
        <p className="empty-state">No compute jobs published yet.</p>
      )}

      {!initialLoading && vouchers.length > 0 && (
        <div className="voucher-grid">
          {vouchers.map((v) => (
            <VoucherCard
              key={v.id.toString()}
              voucher={v}
              job={jobs[v.id.toString()]}
              onChanged={reload}
            />
          ))}
        </div>
      )}
    </>
  );
}
