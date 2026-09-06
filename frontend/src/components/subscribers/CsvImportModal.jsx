import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, Download } from "lucide-react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { subscriberApi } from "../../api/client";
import { useToast } from "../../context/ToastContext";

const SAMPLE_CSV = "name,email\nAmara Chen,amara@example.com\nLiam Ortiz,liam@example.com\n";

export default function CsvImportModal({ open, onClose, onImported }) {
  const toast = useToast();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  function reset() {
    setFile(null);
    setResult(null);
    setDragOver(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleImport() {
    if (!file) return;
    setImporting(true);
    try {
      const { data } = await subscriberApi.uploadCsv(file);
      setResult({ count: data.count });
      toast.success(`Imported ${data.count} subscriber${data.count === 1 ? "" : "s"}.`);
      onImported();
    } catch (err) {
      toast.error(err.response?.data?.message || "Import failed. Check the file and try again.");
    } finally {
      setImporting(false);
    }
  }

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Import subscribers"
      subtitle="Upload a CSV with name and email columns."
    >
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) setFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors ${
          dragOver ? "border-signal-violet bg-signal-violet/5" : "border-ink-500 hover:border-ink-400"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <FileSpreadsheet size={28} className="text-signal-violet" />
            <p className="text-sm font-medium text-mist-100">{file.name}</p>
            <p className="text-xs text-mist-400">{(file.size / 1024).toFixed(1)} KB · click to change</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud size={28} className="text-mist-400" />
            <p className="text-sm font-medium text-mist-100">Drop your CSV here, or click to browse</p>
            <p className="text-xs text-mist-400">Columns: name, email</p>
          </div>
        )}
      </div>

      <button
        onClick={downloadSample}
        className="mt-3 flex items-center gap-1.5 text-xs font-medium text-signal-violet hover:underline"
      >
        <Download size={13} />
        Download a sample CSV
      </button>

      {result && (
        <div className="mt-4 rounded-lg border border-status-mint/30 bg-status-mint/10 px-3.5 py-2.5 text-sm text-status-mint">
          Imported {result.count} new subscriber{result.count === 1 ? "" : "s"}. Rows with missing fields,
          invalid emails, or existing addresses were skipped automatically.
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={handleClose}>
          Close
        </Button>
        <Button onClick={handleImport} disabled={!file} loading={importing} icon={UploadCloud}>
          Import
        </Button>
      </div>
    </Modal>
  );
}
