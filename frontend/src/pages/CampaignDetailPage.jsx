import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Send as SendIcon,
  Pencil,
  Trash2,
  Mail,
  CalendarClock,
  XCircle,
} from "lucide-react";

import AppLayout from "../components/layout/AppLayout";
import Button from "../components/ui/Button";
import { Card, Badge, PageLoader } from "../components/ui/primitives";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import CampaignFormModal from "../components/campaigns/CampaignFormModal";
import { campaignApi } from "../api/client";
import { useToast } from "../context/ToastContext";

function formatDateTime(d) {
  if (!d) return "—";

  return new Date(d).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [cancelScheduleOpen, setCancelScheduleOpen] = useState(false);

  const [scheduledAt, setScheduledAt] = useState("");

  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [cancellingSchedule, setCancellingSchedule] = useState(false);

  async function load() {
    setLoading(true);

    try {
      const { data } = await campaignApi.get(id);
      setCampaign(data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Couldn't load this campaign."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSend() {
    setSending(true);

    try {
      await campaignApi.send(id);

      toast.success("Campaign sent to your active subscribers.");

      setSendOpen(false);

      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Sending failed.");
    } finally {
      setSending(false);
    }
  }

  async function handleSchedule() {
    if (!scheduledAt) {
      toast.error("Please select a date and time.");
      return;
    }

    const scheduleTime = new Date(scheduledAt);

    if (isNaN(scheduleTime.getTime())) {
      toast.error("Invalid date and time.");
      return;
    }

    if (scheduleTime <= new Date()) {
      toast.error("Scheduled time must be in the future.");
      return;
    }

    setScheduling(true);

    try {
      await campaignApi.schedule(
        id,
        scheduleTime.toISOString()
      );

      toast.success("Campaign scheduled successfully.");

      setScheduleOpen(false);
      setScheduledAt("");

      load();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't schedule campaign."
      );
    } finally {
      setScheduling(false);
    }
  }

  async function handleReschedule() {
    if (!scheduledAt) {
      toast.error("Please select a date and time.");
      return;
    }

    const scheduleTime = new Date(scheduledAt);

    if (isNaN(scheduleTime.getTime())) {
      toast.error("Invalid date and time.");
      return;
    }

    if (scheduleTime <= new Date()) {
      toast.error("Scheduled time must be in the future.");
      return;
    }

    setRescheduling(true);

    try {
      await campaignApi.reschedule(
        id,
        scheduleTime.toISOString()
      );

      toast.success("Campaign rescheduled successfully.");

      setRescheduleOpen(false);
      setScheduledAt("");

      load();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't reschedule campaign."
      );
    } finally {
      setRescheduling(false);
    }
  }

  async function handleCancelSchedule() {
    setCancellingSchedule(true);

    try {
      await campaignApi.cancelSchedule(id);

      toast.success("Campaign schedule cancelled.");

      setCancelScheduleOpen(false);

      load();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't cancel schedule."
      );
    } finally {
      setCancellingSchedule(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);

    try {
      await campaignApi.remove(id);

      toast.success("Campaign deleted.");

      navigate("/campaigns");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't delete this campaign."
      );

      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AppLayout title="Campaign">
        <PageLoader />
      </AppLayout>
    );
  }

  if (!campaign) {
    return null;
  }

  const isDraft = campaign.status === "draft";
  const isScheduled = campaign.status === "scheduled";
  const isSending = campaign.status === "sending";
  const alreadySent = campaign.status === "sent";

  return (
    <AppLayout
      title={
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 text-2xl"
        >
          <ArrowLeft
            size={20}
            className="text-mist-400"
          />
          Campaign
        </Link>
      }
      actions={
        <>
          {!isSending && !alreadySent && (
            <Button
              variant="secondary"
              icon={Pencil}
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
          )}

          {!isSending && (
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => setDeleteOpen(true)}
            >
              Delete
            </Button>
          )}

          {isDraft && (
            <Button
              icon={CalendarClock}
              onClick={() => setScheduleOpen(true)}
            >
              Schedule
            </Button>
          )}

          {isScheduled && (
            <Button
              variant="secondary"
              icon={CalendarClock}
              onClick={() => setRescheduleOpen(true)}
            >
              Reschedule
            </Button>
          )}

          {isScheduled && (
            <Button
              variant="danger"
              icon={XCircle}
              onClick={() => setCancelScheduleOpen(true)}
            >
              Cancel schedule
            </Button>
          )}

          {!isScheduled && !isSending && (
            <Button
              icon={SendIcon}
              onClick={() => setSendOpen(true)}
              disabled={alreadySent}
            >
              {alreadySent ? "Already sent" : "Send campaign"}
            </Button>
          )}
        </>
      }
    >
      <div className="grid gap-5 lg:grid-cols-3">

        <Card className="p-6 lg:col-span-2">

          <div className="flex items-center gap-3 mb-4">
            <Badge status={campaign.status} />

            <span className="text-xs text-mist-400">
              {campaign.sentAt
                ? `Sent ${formatDateTime(campaign.sentAt)}`
                : campaign.scheduledAt &&
                  campaign.status === "scheduled"
                ? `Scheduled ${formatDateTime(
                    campaign.scheduledAt
                  )}`
                : `Created ${formatDateTime(
                    campaign.createdAt
                  )}`}
            </span>
          </div>

          <h2 className="font-display text-xl font-semibold text-mist-100 mb-4">
            {campaign.subject}
          </h2>

          <div className="rounded-xl border border-ink-600 bg-ink-900/50 p-5">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-mist-100/90">
              {campaign.content}
            </p>
          </div>

        </Card>

        <Card className="p-6">

          <div className="flex items-center gap-2 mb-4">
            <Mail
              size={16}
              className="text-signal-violet"
            />

            <h3 className="font-display font-semibold text-mist-100">
              Delivery
            </h3>
          </div>

          <dl className="space-y-3 text-sm">

            <div className="flex justify-between">
              <dt className="text-mist-400">
                Status
              </dt>

              <dd className="text-mist-100 capitalize">
                {campaign.status}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-mist-400">
                Scheduled at
              </dt>

              <dd className="text-mist-100">
                {campaign.scheduledAt
                  ? formatDateTime(campaign.scheduledAt)
                  : "Not scheduled"}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-mist-400">
                Sent at
              </dt>

              <dd className="text-mist-100">
                {campaign.sentAt
                  ? formatDateTime(campaign.sentAt)
                  : "Not sent"}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="text-mist-400">
                Created
              </dt>

              <dd className="text-mist-100">
                {formatDateTime(campaign.createdAt)}
              </dd>
            </div>

          </dl>

          <p className="mt-5 text-xs leading-relaxed text-mist-400">
            Sending delivers to every subscriber with an{" "}
            <span className="text-status-mint">
              active
            </span>{" "}
            status. Per-recipient delivery, open, and click
            tracking isn't captured by the current server, so
            those metrics aren't shown here.
          </p>

        </Card>

      </div>

      <CampaignFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        campaign={campaign}
        onSaved={load}
      />

      <ConfirmDialog
        open={sendOpen}
        onClose={() => setSendOpen(false)}
        onConfirm={handleSend}
        loading={sending}
        confirmLabel="Send now"
        title="Send this campaign?"
        description="This emails every active subscriber on your list immediately. This can't be undone."
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete campaign"
        description={`This permanently deletes "${campaign.subject}". This can't be undone.`}
      />

      <ConfirmDialog
        open={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
          setScheduledAt("");
        }}
        onConfirm={handleSchedule}
        loading={scheduling}
        confirmLabel="Schedule campaign"
        title="Schedule campaign"
        description={
          <div className="space-y-3">
            <p>
              Choose when you want this campaign to be sent.
            </p>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) =>
                setScheduledAt(e.target.value)
              }
              min={new Date()
                .toISOString()
                .slice(0, 16)}
              className="w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-2.5 text-sm text-mist-100"
            />
          </div>
        }
      />

      <ConfirmDialog
        open={rescheduleOpen}
        onClose={() => {
          setRescheduleOpen(false);
          setScheduledAt("");
        }}
        onConfirm={handleReschedule}
        loading={rescheduling}
        confirmLabel="Reschedule campaign"
        title="Reschedule campaign"
        description={
          <div className="space-y-3">
            <p>
              Choose the new date and time for this campaign.
            </p>

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) =>
                setScheduledAt(e.target.value)
              }
              min={new Date()
                .toISOString()
                .slice(0, 16)}
              className="w-full rounded-lg border border-ink-600 bg-ink-800 px-3 py-2.5 text-sm text-mist-100"
            />
          </div>
        }
      />

      <ConfirmDialog
        open={cancelScheduleOpen}
        onClose={() =>
          setCancelScheduleOpen(false)
        }
        onConfirm={handleCancelSchedule}
        loading={cancellingSchedule}
        confirmLabel="Cancel schedule"
        title="Cancel scheduled campaign?"
        description={`"${campaign.subject}" will no longer be sent automatically. You can schedule it again later.`}
      />

    </AppLayout>
  );
}