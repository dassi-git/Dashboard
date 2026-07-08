import React from 'react';
import ModalFilterBar from './ModalFilterBar';
import type useRequestFilters from './useRequestFilters';

export interface ToolbarProps {
  filters: ReturnType<typeof useRequestFilters>;
  toggleSidebar: () => void;
}

const RequestsModalToolbar: React.FC<ToolbarProps> = ({ filters, toggleSidebar }) => {
  return (
    <ModalFilterBar
      searchTerm={filters.generalSearch}
      setSearchTerm={filters.setGeneralSearch}
      activeFilters={filters.activeFilters}
      setActiveFilters={filters.setActiveFilters}
      totalResults={filters.filteredRequests.length}
      toggleSidebar={toggleSidebar}
      onExportCsv={filters.exportToCsv}
      sortOrder={filters.sortOrder}
      onSortOrderChange={filters.setSortOrder}
    />
  );
};

export default RequestsModalToolbar;
