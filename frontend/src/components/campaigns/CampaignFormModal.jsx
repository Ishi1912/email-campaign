import { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { Field, Input, Textarea } from "../ui/Field";
import Button from "../ui/Button";
import AiComposePanel from "./AiComposePanel";
import SpamRiskAnalyzer from "./SpamRiskAnalyzer";
import { campaignApi, subscriberApi } from "../../api/client";
import { useToast } from "../../context/ToastContext";

export default function CampaignFormModal({
  open,
  onClose,
  onSaved,
  campaign,
}) {
  const toast = useToast();
  const isEdit = Boolean(campaign?._id);

  const [form, setForm] = useState({
    subject: "",
    content: "",
  });

  const [saving, setSaving] = useState(false);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    if (open) {
      setForm({
        subject: campaign?.subject || "",
        content: campaign?.content || "",
      });

      subscriberApi
        .list()
        .then(({ data }) => setSubscribers(data.data || []))
        .catch(() => setSubscribers([]));
    }
  }, [open, campaign]);

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    try {
      if (isEdit) {
        await campaignApi.update(campaign._id, form);
        toast.success("Campaign updated.");
      } else {
        await campaignApi.create(form);
        toast.success("Campaign saved as a draft.");
      }

      onSaved();
      onClose();
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Couldn't save this campaign."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit campaign" : "New campaign"}
      subtitle="Write it yourself, or let AI draft a starting point."
      width="max-w-2xl"
    >
      <div className="space-y-5">

        {/* AI Email Composer */}
        <AiComposePanel
          subscribers={subscribers}
          onGenerated={(data) =>
            setForm({
              subject: data.subject || form.subject,
              content: data.content || form.content,
            })
          }
        />

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Subject */}
          <Field label="Subject line">
            <Input
              required
              placeholder="Your autumn sale starts now"
              value={form.subject}
              onChange={(e) =>
                setForm({
                  ...form,
                  subject: e.target.value,
                })
              }
            />
          </Field>

          {/* Email Content */}
          <Field label="Email content">
            <Textarea
              required
              rows={9}
              placeholder="Write your email, or generate a draft above…"
              value={form.content}
              onChange={(e) =>
                setForm({
                  ...form,
                  content: e.target.value,
                })
              }
            />
          </Field>

          {/* Spam Risk Analyzer */}
          <SpamRiskAnalyzer
            subject={form.subject}
            content={form.content}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={saving}
            >
              {isEdit ? "Save changes" : "Save as draft"}
            </Button>
          </div>

        </form>
      </div>
    </Modal>
  );
}