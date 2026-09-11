import { useState } from "react";
import {
    ShieldCheck,
    AlertTriangle,
    CheckCircle2,
    Loader2,
} from "lucide-react";

import Button from "../ui/Button";
import { aiApi } from "../../api/client";

export default function SpamRiskAnalyzer({ subject, content }) {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    async function handleCheckRisk() {
        if (!subject.trim() || !content.trim()) {
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await aiApi.checkSpamRisk(
                subject,content
            );
            
            setResult(response.data.data);
        } catch (error) {
            console.error("Spam risk check failed:", error);
            
            setResult({
                error:
                error.response?.data?.message ||
                "Unable to analyze spam risk.",
            });
        } finally {
            setLoading(false);
        }
    }

    function getRiskClasses(risk) {
        switch (risk) {
            case "Low":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
                
            case "Medium":
                return "bg-amber-50 text-amber-700 border-amber-200";

            case "High":
                return "bg-orange-50 text-orange-700 border-orange-200";

            case "Critical":
                return "bg-red-50 text-red-700 border-red-200";

            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <ShieldCheck
                size={19}
                className="text-slate-700"
                />
            </div>

            <div>
                <h3 className="text-sm font-semibold text-slate-900">
                Spam Risk Analyzer
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                Check your email for spam-like content before sending.
                </p>
            </div>
            </div>

            {/* Check button */}
            <Button
            type="button"
            variant="secondary"
            onClick={handleCheckRisk}
            disabled={
                loading ||
                !subject.trim() ||
                !content.trim()
            }
            >
            {loading ? (
                <span className="flex items-center gap-2">
                <Loader2
                    size={15}
                    className="animate-spin"
                />
                Checking...
                </span>
            ) : (
                "Check Spam Risk"
            )}
            </Button>
        </div>

        {/* Initial message */}
        {!result && !loading && (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-3">
            <p className="text-xs text-slate-500">
                Write your subject and email content, then click{" "}
                <span className="font-medium text-slate-700">
                Check Spam Risk
                </span>{" "}
                to analyze it.
            </p>
            </div>
        )}

        {/* Loading */}
        {loading && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-white px-4 py-5 text-center">
            <Loader2
                size={20}
                className="mx-auto animate-spin text-slate-500"
            />

            <p className="mt-2 text-xs text-slate-500">
                Analyzing your email...
            </p>
            </div>
        )}

        {/* Error */}
        {result?.error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">
            <div className="flex items-start gap-2">
                <AlertTriangle
                size={16}
                className="mt-0.5 text-red-600"
                />

                <div>
                <p className="text-sm font-medium text-red-700">
                    Analysis failed
                </p>

                <p className="mt-1 text-xs text-red-600">
                    {result.error}
                </p>
                </div>
            </div>
            </div>
        )}

        {/* Result */}
        {result && !result.error && (
            <div className="mt-4 space-y-4">

            {/* Score */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
                <div>
                <p className="text-xs text-slate-500">
                    Spam Risk Score
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900">
                    {result.score}
                    <span className="text-sm font-medium text-slate-400">
                    /100
                    </span>
                </p>
                </div>

                <div
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getRiskClasses(
                    result.risk
                )}`}
                >
                {result.risk} Risk
                </div>
            </div>

            {/* AI status */}
            <div className="flex items-center gap-2 text-xs">
                {result.aiAvailable ? (
                <>
                    <CheckCircle2
                    size={14}
                    className="text-emerald-600"
                    />

                    <span className="text-slate-600">
                    Rule-based + AI analysis completed
                    </span>
                </>
                ) : (
                <>
                    <AlertTriangle
                    size={14}
                    className="text-amber-600"
                    />

                    <span className="text-slate-600">
                    AI analysis unavailable. Showing rule-based analysis.
                    </span>
                </>
                )}
            </div>

            {/* Rule and AI scores */}
            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">
                    Rule Score
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                    {result.ruleScore ?? "—"}
                </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs text-slate-500">
                    AI Score
                </p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                    {result.aiScore ?? "Unavailable"}
                </p>
                </div>
            </div>

            {/* Issues */}
            {result.issues?.length > 0 && (
                <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Detected Issues
                </h4>

                <div className="mt-2 space-y-2">
                    {result.issues.map((issue, index) => (
                    <div
                        key={index}
                        className="flex items-start gap-2 rounded-lg border border-slate-200 bg-white p-3"
                    >
                        <AlertTriangle
                        size={15}
                        className="mt-0.5 shrink-0 text-amber-500"
                        />

                        <p className="text-xs leading-5 text-slate-700">
                        {issue}
                        </p>
                    </div>
                    ))}
                </div>
                </div>
            )}

            {/* Suggestions */}
            {result.suggestions?.length > 0 && (
                <div>
                <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Suggestions
                </h4>

                <div className="mt-2 space-y-2">
                    {result.suggestions.map(
                    (suggestion, index) => (
                        <div
                        key={index}
                        className="flex items-start gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3"
                        >
                        <CheckCircle2
                            size={15}
                            className="mt-0.5 shrink-0 text-emerald-600"
                        />

                        <p className="text-xs leading-5 text-slate-700">
                            {suggestion}
                        </p>
                        </div>
                    )
                    )}
                </div>
                </div>
            )}

            {/* Disclaimer */}
            <p className="text-[11px] leading-4 text-slate-400">
                This is a content-based spam risk estimate. It does not
                guarantee inbox placement or determine how Gmail, Outlook,
                or another email provider will classify the message.
            </p>
            </div>
        )}
        </div>
    );
    }