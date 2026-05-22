import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import FilterBar from './components/FilterBar';
import KpiStrip from './components/KpiStrip';
import LeadList from './components/LeadList';
import TimelineDialog from './components/TimelineDialog';
import AddLeadDialog from './components/AddLeadDialog';
import { api } from './services/api';
import { isToday } from './utils/time';
import { STATUS_FILTERS } from './utils/status';

function Toast({ toast, onClear }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClear, 3200);
    return () => clearTimeout(t);
  }, [toast, onClear]);

  if (!toast) return null;
  return <div className={`toast${toast.kind === 'error' ? ' error' : ''}`}>{toast.message}</div>;
}

export default function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openLeadId, setOpenLeadId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, kind = 'info') => {
    setToast({ message, kind });
  }, []);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 220);
    return () => clearTimeout(t);
  }, [search]);

  // focus search input with ⌘K or Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      const data = await api.listLeads({
        status: statusFilter,
        search: debouncedSearch,
      });
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message || 'Failed to load leads', 'error');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedSearch, showToast]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // counts driven by an unfiltered copy — fetched once + after mutations
  const [allLeadsForCounts, setAllLeadsForCounts] = useState([]);
  const refreshCounts = useCallback(async () => {
    try {
      const data = await api.listLeads();
      setAllLeadsForCounts(Array.isArray(data) ? data : []);
    } catch {
      /* non-fatal */
    }
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  const counts = useMemo(() => {
    const c = Object.fromEntries(STATUS_FILTERS.map((s) => [s, 0]));
    c.All = allLeadsForCounts.length;
    for (const l of allLeadsForCounts) {
      if (c[l.status] != null) c[l.status] += 1;
    }
    return c;
  }, [allLeadsForCounts]);

  // split: pinned (followUp today) and the rest
  const { pinned, rest } = useMemo(() => {
    const p = [];
    const r = [];
    for (const l of leads) {
      if (l.followUp && isToday(l.followUp)) p.push(l);
      else r.push(l);
    }
    return { pinned: p, rest: r };
  }, [leads]);

  const openLead = useMemo(
    () => leads.find((l) => l._id === openLeadId) || null,
    [leads, openLeadId]
  );

  // mutations -----------------------------------------------
  const handleCreateLead = async (payload) => {
    const created = await api.createLead(payload);
    const withDiscussions = { ...created, discussions: [] };
    setLeads((prev) => [withDiscussions, ...prev]);
    setAllLeadsForCounts((prev) => [withDiscussions, ...prev]);
    setShowAdd(false);
    showToast(`Lead "${created.name}" added`);
  };

  const handleStatusChange = async (newStatus) => {
    if (!openLead) return;
    const prevStatus = openLead.status;

    setLeads((prev) =>
      prev.map((l) => (l._id === openLead._id ? { ...l, status: newStatus } : l))
    );
    setAllLeadsForCounts((prev) =>
      prev.map((l) => (l._id === openLead._id ? { ...l, status: newStatus } : l))
    );

    try {
      await api.updateLead(openLead._id, { status: newStatus });
      showToast(`Status updated to ${newStatus}`);
    } catch (err) {
      // revert
      setLeads((prev) =>
        prev.map((l) =>
          l._id === openLead._id ? { ...l, status: prevStatus } : l
        )
      );
      setAllLeadsForCounts((prev) =>
        prev.map((l) =>
          l._id === openLead._id ? { ...l, status: prevStatus } : l
        )
      );
      showToast(err.message || 'Could not update status', 'error');
    }
  };

  const handleAddDiscussion = async ({ note, followUp }) => {
    if (!openLead) return;
    const result = await api.createDiscussion(openLead._id, { note, followUp });
    const newDiscussion = result.discussion;
    const updatedLead = result.lead || openLead;

    setLeads((prev) =>
      prev.map((l) => {
        if (l._id !== openLead._id) return l;
        const merged = {
          ...l,
          ...updatedLead,
          discussions: [newDiscussion, ...(l.discussions || [])],
        };
        return merged;
      })
    );
    setAllLeadsForCounts((prev) =>
      prev.map((l) =>
        l._id === openLead._id ? { ...l, ...updatedLead } : l
      )
    );
    showToast('Discussion saved');
  };

  const handleDeleteLead = async (lead) => {
    try {
      await api.deleteLead(lead._id);
      setLeads((prev) => prev.filter((l) => l._id !== lead._id));
      setAllLeadsForCounts((prev) => prev.filter((l) => l._id !== lead._id));
      setOpenLeadId(null);
      showToast(`Deleted "${lead.name}"`);
    } catch (err) {
      showToast(err.message || 'Could not delete lead', 'error');
    }
  };

  return (
    <div className="app">
      <div className="app-container">
        <Header
          search={search}
          onSearchChange={setSearch}
          onAddLead={() => setShowAdd(true)}
        />

        <KpiStrip leads={allLeadsForCounts} />

        <div className="toolbar">
          <span className="toolbar-label">Filter by status</span>
          <FilterBar
            active={statusFilter}
            onChange={setStatusFilter}
            counts={counts}
          />
        </div>

        <LeadList
          pinned={pinned}
          all={rest}
          loading={loading}
          onSelect={(lead) => setOpenLeadId(lead._id)}
        />
      </div>

      {openLead ? (
        <TimelineDialog
          lead={openLead}
          onClose={() => setOpenLeadId(null)}
          onStatusChange={handleStatusChange}
          onAddDiscussion={handleAddDiscussion}
          onDeleteLead={handleDeleteLead}
        />
      ) : null}

      {showAdd ? (
        <AddLeadDialog
          onClose={() => setShowAdd(false)}
          onCreate={handleCreateLead}
        />
      ) : null}

      <Toast toast={toast} onClear={() => setToast(null)} />
    </div>
  );
}
