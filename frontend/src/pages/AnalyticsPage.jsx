import { useEffect, useMemo, useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LineChart,
  Line,
} from "recharts";
import AppLayout from "../components/layout/AppLayout";
import { Card, PageLoader, EmptyState } from "../components/ui/primitives";
import Button from "../components/ui/Button";
import { subscriberApi, campaignApi, aiApi } from "../api/client";
import { useToast } from "../context/ToastContext";
import { BarChart3 } from "lucide-react";

const SUB_COLORS = { active: "#34D399", unsubscribed: "#9C9BC0", bounced: "#FF6859" };
const CAMPAIGN_COLORS = { draft: "#9C9BC0", scheduled: "#F5B84E", sending: "#5AA9FF", sent: "#34D399" };

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-ink-500 bg-ink-800 px-3 py-2 text-xs shadow-card">
      <p className="text-mist-400 mb-0.5">{label}</p>
      <p className="font-mono text-mist-100">{payload[0].value}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const toast = useToast();
  const [subscribers, setSubscribers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [subsRes, campsRes] = await Promise.all([subscriberApi.list(), campaignApi.list()]);
        setSubscribers(subsRes.data.data || []);
        setCampaigns(campsRes.data.data || []);
      } catch (err) {
        toast.error(err.response?.data?.message || "Couldn't load analytics.");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subscriberBreakdown = useMemo(
    () =>
      ["active", "unsubscribed", "bounced"].map((status) => ({
        status,
        count: subscribers.filter((s) => s.status === status).length,
      })),
    [subscribers]
  );

  const campaignBreakdown = useMemo(
    () =>
      ["draft", "scheduled", "sending", "sent"].map((status) => ({
        status,
        count: campaigns.filter((c) => c.status === status).length,
      })),
    [campaigns]
  );

  const sendTimeline = useMemo(() => {
    const sent = campaigns.filter((c) => c.sentAt).sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
    let running = 0;
    return sent.map((c) => {
      running += 1;
      return {
        date: new Date(c.sentAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        total: running,
      };
    });
  }, [campaigns]);

  async function handleGenerateInsights() {
    setGenerating(true);
    try {
      const active = subscribers.filter((s) => s.status === "active").length;
      const bounced = subscribers.filter((s) => s.status === "bounced").length;
      const unsub = subscribers.filter((s) => s.status === "unsubscribed").length;
      const sent = campaigns.filter((c) => c.status === "sent").length;
      const draft = campaigns.filter((c) => c.status === "draft").length;

      const prompt = `Act as an email marketing analyst. Here is my account's current data:
- Total subscribers: ${subscribers.length} (active: ${active}, unsubscribed: ${unsub}, bounced: ${bounced})
- Total campaigns: ${campaigns.length} (sent: ${sent}, draft: ${draft})

Write a short performance summary and 3-4 concrete, specific recommendations for improving
list health and campaign output going forward. Format your response as the body of a short
internal memo, not a sales email. Do not use placeholders.`;

      const { data } = await aiApi.generate(prompt);
      setInsights(data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't generate insights. Check that the server's GEMINI_API_KEY is configured."
      );
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <AppLayout title="Analytics">
        <PageLoader />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Analytics" subtitle="What's actually tracked by the server, plus an AI-written summary.">
      <div className="grid gap-5 lg:grid-cols-2 mb-6">
        <Card className="p-6">
          <h3 className="font-display font-semibold text-mist-100 mb-1">Subscribers by status</h3>
          <p className="text-sm text-mist-400 mb-4">{subscribers.length} total</p>
          {subscribers.length === 0 ? (
            <EmptyState icon={BarChart3} title="No data yet" description="Add subscribers to see this chart." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={subscriberBreakdown} barSize={48}>
                <CartesianGrid vertical={false} stroke="#212446" />
                <XAxis dataKey="status" stroke="#9C9BC0" fontSize={12} tickLine={false} axisLine={false} className="capitalize" />
                <YAxis stroke="#9C9BC0" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(140,107,255,0.06)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {subscriberBreakdown.map((entry) => (
                    <Cell key={entry.status} fill={SUB_COLORS[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="font-display font-semibold text-mist-100 mb-1">Campaigns by status</h3>
          <p className="text-sm text-mist-400 mb-4">{campaigns.length} total</p>
          {campaigns.length === 0 ? (
            <EmptyState icon={BarChart3} title="No data yet" description="Create campaigns to see this chart." />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={campaignBreakdown} barSize={48}>
                <CartesianGrid vertical={false} stroke="#212446" />
                <XAxis dataKey="status" stroke="#9C9BC0" fontSize={12} tickLine={false} axisLine={false} className="capitalize" />
                <YAxis stroke="#9C9BC0" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(140,107,255,0.06)" }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {campaignBreakdown.map((entry) => (
                    <Cell key={entry.status} fill={CAMPAIGN_COLORS[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="font-display font-semibold text-mist-100 mb-1">Campaigns sent over time</h3>
        <p className="text-sm text-mist-400 mb-4">Cumulative count of sent campaigns.</p>
        {sendTimeline.length === 0 ? (
          <EmptyState icon={BarChart3} title="Nothing sent yet" description="Send a campaign to start this timeline." />
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={sendTimeline}>
              <CartesianGrid vertical={false} stroke="#212446" />
              <XAxis dataKey="date" stroke="#9C9BC0" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#9C9BC0" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="total" stroke="#8C6BFF" strokeWidth={2.5} dot={{ r: 3, fill: "#8C6BFF" }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-signal-violet" />
            <h3 className="font-display font-semibold text-mist-100">AI insights</h3>
          </div>
          <Button size="sm" variant="secondary" icon={Wand2} loading={generating} onClick={handleGenerateInsights}
            className="border-signal-violet/30 text-signal-violet hover:bg-signal-violet/10">
            Generate insights
          </Button>
        </div>

        {insights ? (
          <div className="mt-4 rounded-xl border border-signal-violet/20 bg-signal-violet/[0.05] p-5">
            {insights.subject && (
              <p className="text-sm font-semibold text-mist-100 mb-2">{insights.subject}</p>
            )}
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-mist-100/90">{insights.content}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-mist-400 leading-relaxed">
            Generate a written summary and recommendations based on your current subscriber and campaign
            counts, using the same AI endpoint that powers campaign drafting.
          </p>
        )}
      </Card>
    </AppLayout>
  );
}
