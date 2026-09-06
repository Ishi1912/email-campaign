import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import { Field, Textarea, Select } from "../ui/Field";
import Button from "../ui/Button";
import { aiApi } from "../../api/client";
import { useToast } from "../../context/ToastContext";

const TONES = ["professional", "friendly", "persuasive", "casual", "urgent", "formal"];

function buildPrompt({ brief, tone, subscriber }) {
  let prompt = `${brief.trim()}\n\nWrite in a ${tone} tone.`;
  if (subscriber) {
    prompt += ` Personalize it for this specific recipient - ${
      subscriber.name ? `their name is ${subscriber.name}` : "use a warm generic greeting"
    }, and address them directly. Do not use a generic "Dear Subscriber" greeting.`;
  }
  return prompt;
}

export default function AiComposePanel({ subscribers = [], onGenerated }) {
  const toast = useToast();
  const [brief, setBrief] = useState("");
  const [tone, setTone] = useState("professional");
  const [subscriberId, setSubscriberId] = useState("");
  const [generating, setGenerating] = useState(false);

  async function handleGenerate() {
    if (!brief.trim()) {
      toast.error("Describe what the email should say first.");
      return;
    }
    setGenerating(true);
    try {
      const subscriber = subscribers.find((s) => s._id === subscriberId);
      const prompt = buildPrompt({ brief, tone, subscriber });
      const { data } = await aiApi.generate(prompt);
      onGenerated(data.data);
      toast.success("Draft generated. Review it below before saving.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "AI generation failed. Check that the server's GEMINI_API_KEY is configured."
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="rounded-xl border border-signal-violet/30 bg-signal-violet/[0.06] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={15} className="text-signal-violet" />
        <p className="text-sm font-semibold text-mist-100">Draft with AI</p>
      </div>

      <div className="space-y-3">
        <Field label="What's this email about?">
          <Textarea
            rows={2}
            placeholder="Announce our autumn sale — 20% off all plans through the end of the month"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Tone">
            <Select value={tone} onChange={(e) => setTone(e.target.value)}>
              {TONES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Personalize for (optional)">
            <Select value={subscriberId} onChange={(e) => setSubscriberId(e.target.value)}>
              <option value="">No specific recipient</option>
              {subscribers.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name || s.email}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          icon={Wand2}
          onClick={handleGenerate}
          loading={generating}
          className="w-full border-signal-violet/30 text-signal-violet hover:bg-signal-violet/10"
        >
          Generate draft
        </Button>
        <p className="text-[11px] text-mist-400 leading-relaxed">
          Tone and recipient details are included in the prompt sent to the AI. The
          server's base instructions default to a professional tone, so results may
          lean that way regardless of selection.
        </p>
      </div>
    </div>
  );
}
