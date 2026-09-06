import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Send, CheckCircle2, FileEdit, Plus, Upload, ArrowRight } from "lucide-react";
import AppLayout from "../components/layout/AppLayout";
import StatCard from "../components/dashboard/StatCard";
import SignalFlow from "../components/dashboard/SignalFlow";
import { Card, Badge, PageLoader, EmptyState } from "../components/ui/primitives";
import Button from "../components/ui/Button";
import { subscriberApi, campaignApi } from "../api/client";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import CampaignFormModal from "../components/campaigns/CampaignFormModal";
import SubscriberFormModal from "../components/subscribers/SubscriberFormModal";

const CAMPAIGN_STAGES = [
  { key: "draft", label: "Draft", color: "#9C9BC0" },
  { key: "scheduled", label: "Scheduled", color: "#F5B84E" },
  { key: "sending", label: "Sending", color: "#5AA9FF" },
  { key: "sent", label: "Sent", color: "#34D399" },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [campaignFormOpen, setCampaignFormOpen] = useState(false);
  const [subscriberFormOpen, setSubscriberFormOpen] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [subsRes, campsRes] = await Promise.all([subscriberApi.list(), campaignApi.list()]);
      setSubscribers(subsRes.data.data || []);
      setCampaigns(campsRes.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't load your dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeSubscribers = subscribers.filter((s) => s.status === "active").length;
  const sentCampaigns = campaigns.filter((c) => c.status === "sent").length;

  const stages = useMemo(
    () =>
      CAMPAIGN_STAGES.map((stage) => ({
        ...stage,
        value: campaigns.filter((c) => c.status === stage.key).length,
      })),
    [campaigns]
  );

  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  if (loading) {
    return (
      <AppLayout title="Dashboard">
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Dashboard"
      subtitle={user?.email}
      actions={
        <>
          <Button variant="secondary" icon={Upload} onClick={() => setSubscriberFormOpen(true)}>
            Add subscriber
          </Button>
          <Button icon={Plus} onClick={() => setCampaignFormOpen(true)}>
            New campaign
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard label="Subscribers" value={subscribers.length} icon={Users} accent="#8C6BFF" />
        <StatCard label="Active" value={activeSubscribers} icon={CheckCircle2} accent="#34D399" />
        <StatCard label="Campaigns" value={campaigns.length} icon={FileEdit} accent="#5AA9FF" />
        <StatCard label="Sent" value={sentCampaigns} icon={Send} accent="#F5B84E" />
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-semibold text-mist-100">Campaign flow</h3>
            <p className="text-sm text-mist-400 mt-0.5">Where every campaign in your account currently sits.</p>
          </div>
        </div>
        <SignalFlow stages={stages} total={campaigns.length} />
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-mist-100">Recent campaigns</h3>
          <Link to="/campaigns" className="text-sm font-medium text-signal-violet hover:underline flex items-center gap-1">
            View all <ArrowRight size={13} />
          </Link>
        </div>
        {recentCampaigns.length === 0 ? (
          <EmptyState
            icon={Send}
            title="No campaigns yet"
            description="Create your first campaign to see it appear here."
            action={
              <Button icon={Plus} onClick={() => setCampaignFormOpen(true)}>
                New campaign
              </Button>
            }
          />
        ) : (
          <div className="divide-y divide-ink-600/60">
            {recentCampaigns.map((c) => (
              <Link
                key={c._id}
                to={`/campaigns/${c._id}`}
                className="flex items-center justify-between gap-4 py-3.5 group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-mist-100 truncate group-hover:text-signal-violet transition-colors">
                    {c.subject}
                  </p>
                  <p className="text-xs text-mist-400 mt-0.5">
                    {new Date(c.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </p>
                </div>
                <Badge status={c.status} />
              </Link>
            ))}
          </div>
        )}
      </Card>

      <CampaignFormModal open={campaignFormOpen} onClose={() => setCampaignFormOpen(false)} onSaved={load} />
      <SubscriberFormModal open={subscriberFormOpen} onClose={() => setSubscriberFormOpen(false)} onSaved={load} />
    </AppLayout>
  );
}
