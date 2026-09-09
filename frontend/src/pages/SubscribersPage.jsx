import { useEffect, useMemo, useState } from "react";
import { Plus, Upload, Search, Pencil, Trash2, Users } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Button from "../components/ui/Button";
import { Card, Badge, EmptyState, PageLoader } from "../components/ui/primitives";
import { Input, Select } from "../components/ui/Field";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import SubscriberFormModal from "../components/subscribers/SubscriberFormModal";
import CsvImportModal from "../components/subscribers/CsvImportModal";
import { subscriberApi } from "../api/client";
import { useToast } from "../context/ToastContext";

export default function SubscribersPage() {
  const toast = useToast();
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingSubscriber, setEditingSubscriber] = useState(null);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await subscriberApi.list();
      setSubscribers(data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't load subscribers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    return subscribers.filter((s) => {
      const matchesSearch =
        !search ||
        s.name?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [subscribers, search, statusFilter]);

  async function handleDelete() {
    setDeleting(true);
    try {
      await subscriberApi.remove(deleteTarget._id);
      toast.success("Subscriber removed.");
      setSubscribers((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't remove this subscriber.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AppLayout
      title="Subscribers"
      subtitle={`${subscribers.length} total on your list`}
      actions={
        <>
          <Button variant="secondary" icon={Upload} onClick={() => setImportOpen(true)}>
            Import CSV
          </Button>
          <Button
            icon={Plus}
            onClick={() => {
              setEditingSubscriber(null);
              setFormOpen(true);
            }}
          >
            Add subscriber
          </Button>
        </>
      }
    >
      <Card className="p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-400" />
          <Input
            className="pl-9 bg-ink-900 text-mist-100 border-ink-600 placeholder:text-mist-400"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-48 bg-ink-900 text-mist-100 border-ink-600" >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="unsubscribed">Unsubscribed</option>
          <option value="bounced">Bounced</option>
        </Select>
      </Card>

      <Card className="overflow-hidden">
        {loading ? (
          <PageLoader />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={subscribers.length === 0 ? "No subscribers yet" : "No matches"}
            description={
              subscribers.length === 0
                ? "Add someone manually or import a CSV of name and email columns to get your list started."
                : "Try a different search term or status filter."
            }
            action={
              subscribers.length === 0 && (
                <Button icon={Plus} onClick={() => setFormOpen(true)}>
                  Add subscriber
                </Button>
              )
            }
          />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-600 text-left text-xs uppercase tracking-wider text-mist-400">
                <th className="px-5 py-3.5 font-medium">Name</th>
                <th className="px-5 py-3.5 font-medium">Email</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s._id} className="border-b border-ink-600/60 last:border-0 hover:bg-ink-700/40">
                  <td className="px-5 py-3.5 text-mist-100 font-medium">{s.name || "—"}</td>
                  <td className="px-5 py-3.5 text-mist-400 font-mono text-[13px]">{s.email}</td>
                  <td className="px-5 py-3.5">
                    <Badge status={s.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditingSubscriber(s);
                          setFormOpen(true);
                        }}
                        className="rounded-lg p-2 text-mist-400 hover:bg-ink-600 hover:text-mist-100 transition-colors"
                        aria-label={`Edit ${s.name}`}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(s)}
                        className="rounded-lg p-2 text-mist-400 hover:bg-status-coral/10 hover:text-status-coral transition-colors"
                        aria-label={`Delete ${s.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <SubscriberFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        subscriber={editingSubscriber}
        onSaved={load}
      />
      <CsvImportModal open={importOpen} onClose={() => setImportOpen(false)} onImported={load} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Remove subscriber"
        description={`This permanently removes ${deleteTarget?.name || "this subscriber"} (${deleteTarget?.email}) from your list.`}
      />
    </AppLayout>
  );
}
