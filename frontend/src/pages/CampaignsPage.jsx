import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Send as SendIcon, ArrowRight } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import Button from "../components/ui/Button";
import { Card, Badge, EmptyState, PageLoader } from "../components/ui/primitives";
import CampaignFormModal from "../components/campaigns/CampaignFormModal";
import { campaignApi } from "../api/client";
import { useToast } from "../context/ToastContext";

function formatDate(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function CampaignsPage() {
  const toast = useToast();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await campaignApi.list();
      setCampaigns(data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't load campaigns.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppLayout
      title="Campaigns"
      subtitle={`${campaigns.length} campaign${campaigns.length === 1 ? "" : "s"}`}
      actions={
        <Button icon={Plus} onClick={() => setFormOpen(true)}>
          New campaign
        </Button>
      }
    >
      {loading ? (
        <Card>
          <PageLoader />
        </Card>
      ) : campaigns.length === 0 ? (
        <Card>
          <EmptyState
            icon={SendIcon}
            title="No campaigns yet"
            description="Create a campaign, draft the copy yourself or with AI, then send it to your active subscribers."
            action={
              <Button icon={Plus} onClick={() => setFormOpen(true)}>
                New campaign
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((c) => (
            <Link key={c._id} to={`/campaigns/${c._id}`}>
              <Card className="group flex h-full flex-col p-5 transition-colors hover:border-signal-violet/50">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display font-semibold text-mist-100 leading-snug line-clamp-2">
                    {c.subject}
                  </h3>
                  <Badge status={c.status} />
                </div>
                <p className="mt-2.5 flex-1 text-sm text-mist-400 line-clamp-3 leading-relaxed">
                  {c.content}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-ink-600 pt-3 text-xs text-mist-400">
                  <span>{c.sentAt ? `Sent ${formatDate(c.sentAt)}` : `Created ${formatDate(c.createdAt)}`}</span>
                  <span className="flex items-center gap-1 text-signal-violet opacity-0 transition-opacity group-hover:opacity-100">
                    View <ArrowRight size={13} />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CampaignFormModal open={formOpen} onClose={() => setFormOpen(false)} onSaved={load} />
    </AppLayout>
  );
}
