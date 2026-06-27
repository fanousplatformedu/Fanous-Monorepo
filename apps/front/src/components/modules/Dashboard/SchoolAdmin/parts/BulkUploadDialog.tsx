import { BACKEND_URL } from "@/utils/constant";
import { useCallback, useRef, useMemo, useState } from "react";
import { useI18n } from "@/hooks/useI18n";
import * as D from "@ui/dialog";
import * as L from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
// ─── Types ────────────────────────────────────────────────────────────────────

type UploadPhase = "idle" | "uploading" | "success" | "error";

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls"];
const ACCEPTED_MIME = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
];


interface UploadResult {
  count: number;
  data: { name: string; email: string; classroomName: string }[];
}

export default function BulkUploadDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSuccess: () => void;
}) {
  const { t, dir } = useI18n();

  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const reset = () => {
    setFile(null);
    setPhase("idle");
    setProgress(0);
    setResult(null);
    setErrorMsg("");
    setIsDragging(false);
    xhrRef.current?.abort();
  };

  const handleClose = (v: boolean) => {
    if (!v) reset();
    onOpenChange(v);
  };

  const validateFile = (f: File): boolean => {
    const ext = "." + (f.name.split(".").pop()?.toLowerCase() ?? "");
    if (!ACCEPTED_EXTENSIONS.includes(ext) && !ACCEPTED_MIME.includes(f.type)) {
      setErrorMsg(
        t("dashboard.schoolAdmin.members.bulkUpload.errors.invalidType"),
      );
      setPhase("error");
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg(
        t("dashboard.schoolAdmin.members.bulkUpload.errors.tooLarge"),
      );
      setPhase("error");
      return false;
    }
    return true;
  };

  const pickFile = (f: File) => {
    setErrorMsg("");
    setPhase("idle");
    setResult(null);
    if (validateFile(f)) setFile(f);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) pickFile(f);
    e.target.value = "";
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pickFile(f);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleUpload = () => {
    if (!file) return;
    setPhase("uploading");
    setProgress(0);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;
    xhr.open("POST", `${BACKEND_URL}/school/createManyStudents`);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        setProgress(Math.round((e.loaded / e.total) * 70));
    };

    xhr.upload.onload = () => {
      let p = 70;
      const interval = setInterval(() => {
        p += 3;
        setProgress(Math.min(p, 97));
        if (p >= 97) clearInterval(interval);
      }, 120);
    };

    xhr.onload = () => {
      setProgress(100);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const body = JSON.parse(xhr.responseText) as UploadResult;
          setResult(body);
          setPhase("success");
          onSuccess();
        } catch {
          setErrorMsg(
            t(
              "dashboard.schoolAdmin.members.bulkUpload.errors.unexpectedResponse",
            ),
          );
          setPhase("error");
        }
      } else {
        let msg = t(
          "dashboard.schoolAdmin.members.bulkUpload.errors.uploadFailed",
        );
        try {
          const body = JSON.parse(xhr.responseText) as { message?: string };
          if (body.message) msg = body.message;
        } catch {
          /* ignore */
        }
        setErrorMsg(msg);
        setPhase("error");
      }
    };

    xhr.onerror = () => {
      setErrorMsg(
        t("dashboard.schoolAdmin.members.bulkUpload.errors.networkError"),
      );
      setPhase("error");
    };

    xhr.onabort = () => {
      setPhase("idle");
      setProgress(0);
    };

    xhr.send(formData);
  };

  const isUploading = phase === "uploading";
  const isRtl = dir === "rtl";

  const successTitle = (() => {
    if (!result) return "";
    const key =
      result.count === 1
        ? "dashboard.schoolAdmin.members.bulkUpload.success.title"
        : "dashboard.schoolAdmin.members.bulkUpload.success.titlePlural";
    return t(key, { count: String(result.count) });
  })();

  return (
    <D.Dialog open={open}   onOpenChange={handleClose}>
      <D.DialogContent className="rounded-[1.75rem] sm:max-w-lg p-12" dir={dir}>
        <D.DialogHeader className={isRtl ? "text-right" : "text-left"}>
          <D.DialogTitle className="flex items-center gap-2">
            <L.Users className="size-5 shrink-0 text-primary" />
            {t("dashboard.schoolAdmin.members.bulkUpload.dialog.title")}
          </D.DialogTitle>
          <D.DialogDescription>
            {t("dashboard.schoolAdmin.members.bulkUpload.dialog.description")}
          </D.DialogDescription>
        </D.DialogHeader>

        <div className="space-y-4">
          {/* ── Drop zone ── */}
          <AnimatePresence mode="wait">
            {phase !== "success" && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={() => setIsDragging(false)}
                  onClick={() => !isUploading && inputRef.current?.click()}
                  className={[
                    "relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-colors duration-200 select-none",
                    isDragging
                      ? "border-primary bg-primary/8"
                      : file
                        ? "border-primary/50 bg-primary/5"
                        : "border-border/60 bg-secondary/20 hover:border-primary/40 hover:bg-secondary/40",
                    isUploading ? "pointer-events-none" : "",
                    phase === "error"
                      ? "border-destructive/60 bg-destructive/5"
                      : "",
                  ].join(" ")}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={onInputChange}
                    disabled={isUploading}
                  />

                  {/* Icon badge */}
                  <div
                    className={[
                      "flex size-14 items-center justify-center rounded-2xl transition-colors",
                      phase === "error"
                        ? "bg-destructive/15 text-destructive"
                        : file
                          ? "bg-primary/15 text-primary"
                          : "bg-secondary/60 text-muted-foreground",
                    ].join(" ")}
                  >
                    {phase === "error" ? (
                      <L.AlertCircle className="size-7" />
                    ) : file ? (
                      <L.FileSpreadsheet className="size-7" />
                    ) : (
                      <L.Upload className="size-7" />
                    )}
                  </div>

                  {/* Label */}
                  {phase === "error" ? (
                    <div>
                      <p className="text-sm font-semibold text-destructive">
                        {errorMsg}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t(
                          "dashboard.schoolAdmin.members.bulkUpload.dropzone.replace",
                        )}
                      </p>
                    </div>
                  ) : file ? (
                    <div>
                      <p className="max-w-[260px] truncate text-sm font-semibold text-foreground">
                        {file.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)}{" "}
                        {t(
                          "dashboard.schoolAdmin.members.bulkUpload.dropzone.pickHint",
                        )}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold">
                        {t(
                          "dashboard.schoolAdmin.members.bulkUpload.dropzone.idle",
                        )}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {t(
                          "dashboard.schoolAdmin.members.bulkUpload.dropzone.idleHint",
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Progress bar ── */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4">
                  <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1.2,
                          ease: "linear",
                        }}
                        className="inline-block"
                      >
                        <L.Loader2 className="size-3.5" />
                      </motion.span>
                      {progress < 70
                        ? t(
                            "dashboard.schoolAdmin.members.bulkUpload.progress.uploading",
                          )
                        : t(
                            "dashboard.schoolAdmin.members.bulkUpload.progress.processing",
                          )}
                    </span>
                    <span className="font-medium tabular-nums">
                      {progress}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut", duration: 0.3 }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Success summary ── */}
          <AnimatePresence>
            {phase === "success" && result && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="space-y-3"
              >
                {/* Banner */}
                <div
                  className={`flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 p-4 ${isRtl ? "flex-row-reverse text-right" : ""}`}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20">
                    <L.CheckCircle2 className="size-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                      {successTitle}
                    </p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70">
                      {t(
                        "dashboard.schoolAdmin.members.bulkUpload.success.subtitle",
                      )}
                    </p>
                  </div>
                </div>

                {/* Student list preview */}
                {result.data.length > 0 && (
                  <div className="rounded-2xl border border-border/50 bg-secondary/20">
                    <div className="max-h-52 overflow-y-auto">
                      {result.data.map((s, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: isRtl ? 8 : -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.2 }}
                          className={[
                            "flex items-center gap-3 px-4 py-2.5 text-sm",
                            isRtl ? "flex-row-reverse" : "",
                            i !== result.data.length - 1
                              ? "border-b border-border/40"
                              : "",
                          ].join(" ")}
                        >
                          <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                            {(s.name?.[0] ?? "?").toUpperCase()}
                          </div>
                          <div
                            className={`min-w-0 flex-1 ${isRtl ? "text-right" : ""}`}
                          >
                            <p className="truncate font-medium">{s.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {s.email} · {s.classroomName}
                            </p>
                          </div>
                          <L.UserCheck className="size-4 shrink-0 text-emerald-500" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Format hint ── */}
          {phase === "idle" && !file && (
            <div
              className={`flex items-start gap-2 rounded-xl bg-secondary/30 px-3 py-2.5 text-xs text-muted-foreground ${isRtl ? "flex-row-reverse text-right" : ""}`}
            >
              <L.Info className="mt-0.5 size-3.5 shrink-0" />
              <span>{t("dashboard.schoolAdmin.members.bulkUpload.hint")}</span>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className={`flex gap-3 pt-1 ${isRtl ? "flex-row-reverse" : "justify-end"}`}
        >
          <Button
            type="button"
            variant="brandSoft"
            className="rounded-2xl"
            onClick={() => handleClose(false)}
            disabled={isUploading}
          >
            {phase === "success"
              ? t("dashboard.schoolAdmin.members.bulkUpload.actions.close")
              : t("dashboard.schoolAdmin.members.bulkUpload.actions.cancel")}
          </Button>

          {phase === "success" ? (
            <Button
              type="button"
              variant="brand"
              className="rounded-2xl"
              onClick={() => {
                reset();
                onOpenChange(true);
              }}
            >
              <L.Upload className={`size-4 ${isRtl ? "ms-1.5" : "me-1.5"}`} />
              {t(
                "dashboard.schoolAdmin.members.bulkUpload.actions.uploadAnother",
              )}
            </Button>
          ) : (
            <Button
              type="button"
              variant="brand"
              className="rounded-2xl"
              disabled={!file || isUploading}
              onClick={handleUpload}
            >
              {isUploading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.2,
                      ease: "linear",
                    }}
                    className={`inline-block ${isRtl ? "ms-1.5" : "me-1.5"}`}
                  >
                    <L.Loader2 className="size-4" />
                  </motion.span>
                  {t(
                    "dashboard.schoolAdmin.members.bulkUpload.actions.enrolling",
                  )}
                </>
              ) : (
                <>
                  <L.UserPlus
                    className={`size-4 ${isRtl ? "ms-1.5" : "me-1.5"}`}
                  />
                  {t("dashboard.schoolAdmin.members.bulkUpload.actions.enroll")}
                </>
              )}
            </Button>
          )}
        </div>
      </D.DialogContent>
    </D.Dialog>
  );
}
