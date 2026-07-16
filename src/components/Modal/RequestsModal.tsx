import React, { useEffect } from 'react';
import useRequestFilters from './useRequestFilters';
import ModalSidebar from './ModalSidebar';
import RequestsTable from './RequestsTable';
import RequestsModalToolbar from './RequestsModalToolbar';

export interface RequestsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allRequests: import('./useRequestFilters').RequestItem[];
  initialDistrict?: string;
  initialUnit?: string;
  initialHandler?: string;
  initialKpiType?: string | null;
}

// Layout styles are inlined where used to keep this file compact

/* Sidebar and filter styles moved to ModalSidebar */

export const RequestsModal: React.FC<RequestsModalProps> = ({ isOpen, onClose, allRequests, initialDistrict, initialUnit, initialHandler, initialKpiType }) => {
  const filters = useRequestFilters(allRequests, { initialDistrict, initialUnit, initialHandler, initialKpiType });

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  useEffect(() => {
    console.log('RequestsModal mount', {
      receivedAllRequests: allRequests?.length ?? null,
      initialDistrict,
      initialUnit,
      initialKpiType,
    });

    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === 'Esc') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // filterCounts and filteredRequests are computed in the useRequestFilters hook

  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.35)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <div
        id="requests-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="requests-modal-title"
        style={{ width: '100%', maxWidth: '1180px', maxHeight: '90vh', backgroundColor: '#ffffff', borderRadius: '20px', boxShadow: '0 8px 24px rgba(2,6,23,0.08)', overflow: 'hidden', display: 'flex', flexDirection: 'column', direction: 'rtl' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid rgba(15,23,42,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }} id="requests-modal-title">
            חלון פניות ומסננים
          </div>
          <button type="button" onClick={onClose} aria-label="סגור חלון" style={{ border: 'none', background: 'transparent', color: '#475569', fontSize: '0.95rem', cursor: 'pointer', padding: '0.4rem' }}>
            סגור
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row-reverse',
            direction: 'rtl',
            gap: '0.75rem',
            padding: '0.75rem 1rem 1rem',
            overflow: 'hidden',
            transition: 'all 220ms ease-in-out',
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            <RequestsModalToolbar filters={filters} toggleSidebar={() => setIsSidebarOpen((c) => !c)} />

            <RequestsTable filteredRequests={filters.filteredRequests} />
          </div>

          {isSidebarOpen && (
            <div style={{ width: '320px', flexShrink: 0, transition: 'width 220ms ease-in-out' }}>
              <ModalSidebar isOpen={isSidebarOpen} filters={filters} clearAll={filters.clearAll} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsModal;
