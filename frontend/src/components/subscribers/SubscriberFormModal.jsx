import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { Field, Input, Select } from "../ui/Field";
import Button from "../ui/Button";
import { subscriberApi } from "../../api/client";
import { useToast } from "../../context/ToastContext";

export default function SubscriberFormModal({ open, onClose, onSaved, subscriber }) {
  const toast = useToast();
  const isEdit = Boolean(subscriber?._id);
  const [form, setForm] = useState({ name: "", email: "", status: "active" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm({
        name: subscriber?.name || "",
        email: subscriber?.email || "",
        status: subscriber?.status || "active",
      });
    }
  }, [open, subscriber]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await subscriberApi.update(subscriber._id, form);
        toast.success("Subscriber updated.");
      } else {
        await subscriberApi.create({ name: form.name, email: form.email });
        toast.success("Subscriber added.");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Couldn't save this subscriber.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? "Edit subscriber" : "Add subscriber"}
      subtitle={isEdit ? "Update their details or status." : "Add someone to your list manually."}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Name">
          <Input
            required
            placeholder="Amara Chen"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </Field>
        <Field label="Email">
          <Input
            type="email"
            required
            placeholder="amara@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </Field>
        {isEdit && (
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
            </Select>
          </Field>
        )}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {isEdit ? "Save changes" : "Add subscriber"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
