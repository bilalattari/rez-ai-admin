/*  AddQuestionModal.tsx
    — now supports icon upload per option — */

import { useEffect, useState } from "react";
import { Plus, Trash2, UploadCloud } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-toastify";

/** ---------- Cloudinary config ---------- */
const CLOUD_NAME = "dekm9hhq1";
const UPLOAD_PRESET = "rezzipeai";
const CLOUDINARY_ENDPOINT = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

/** Helper: upload a single file and return its secure URL */
const uploadIconToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  const res = await fetch(CLOUDINARY_ENDPOINT, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Cloudinary upload failed");

  const data = await res.json();
  return data.secure_url;
};

export function AddQuestionModal({ isOpen, onClose, onSubmit, initialData }) {
  /* ---------- state ---------- */
  const [formData, setFormData] = useState({
    text: "",
    questionType: "SINGLE",
    isLive: true,
    options: [
      { label: "", icon: "" },
      { label: "", icon: "" },
    ],
  });
  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  /* ---------- load initial data ---------- */
  useEffect(() => {
    if (initialData) {
      setFormData({
        text: initialData.text ?? "",
        questionType: initialData.questionType ?? "SINGLE",
        isLive: initialData.isLive ?? true,
        options: initialData.options?.map((o) =>
          typeof o === "string" ? { label: o, icon: "" } : o
        ) ?? [
          { label: "", icon: "" },
          { label: "", icon: "" },
        ],
      });
    }
  }, [initialData]);

  /* ---------- field handlers ---------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: null }));
  };

  const handleSwitchChange = (checked) =>
    setFormData((s) => ({ ...s, isLive: checked }));

  const handleTypeChange = (value) =>
    setFormData((s) => ({ ...s, questionType: value }));

  const handleLabelChange = (idx, value) => {
    const opts = [...formData.options];
    opts[idx].label = value;
    setFormData((s) => ({ ...s, options: opts }));
    if (errors.options) setErrors((e) => ({ ...e, options: null }));
  };

  const handleIconUpload = async (idx, file) => {
    try {
      setIsUploading(true);
      const url = await uploadIconToCloudinary(file);
      const opts = [...formData.options];
      opts[idx].icon = url;
      setFormData((s) => ({ ...s, options: opts }));
      toast.success("Icon uploaded");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /* ---------- add / remove option ---------- */
  const addOption = () =>
    setFormData((s) => ({
      ...s,
      options: [...s.options, { label: "", icon: "" }],
    }));

  const removeOption = (idx) => {
    if (formData.options.length <= 2) {
      toast.error("Cannot remove option");
      return;
    }
    setFormData((s) => ({
      ...s,
      options: s.options.filter((_, i) => i !== idx),
    }));
  };

  /* ---------- validation ---------- */
  const validateForm = () => {
    const errs = {};
    if (!formData.text.trim()) errs.text = "Question text is required";

    const filled = formData.options.filter((o) => o.label.trim());
    if (filled.length < 2)
      errs.options = "At least 2 non‑empty labels required";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /* ---------- submit ---------- */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const cleaned = formData.options.filter((o) => o.label.trim());
    onSubmit({ ...formData, options: cleaned });

    // reset
    setFormData({
      text: "",
      questionType: "SINGLE",
      isLive: true,
      options: [
        { label: "", icon: "" },
        { label: "", icon: "" },
      ],
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      text: "",
      questionType: "SINGLE",
      isLive: true,
      options: [
        { label: "", icon: "" },
        { label: "", icon: "" },
      ],
    });
    setErrors({});
    onClose();
  };

  /* ---------- render ---------- */
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit" : "Add"} Question</DialogTitle>
          <DialogDescription>
            Create or update a survey question with labelled options &amp;
            icons.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Question text */}
          <div className="space-y-2">
            <Label htmlFor="text">Question Text</Label>
            <Input
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter your question"
              className={errors.text ? "border-red-500" : ""}
            />
            {errors.text && (
              <p className="text-sm text-red-500">{errors.text}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Question Type</Label>
            <Select
              value={formData.questionType}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE">Single Choice</SelectItem>
                <SelectItem value="MULTIPLE">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Live switch */}
          <div className="flex items-center justify-between">
            <Label>Make Question Live</Label>
            <Switch
              checked={formData.isLive}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Option
              </Button>
            </div>
            {errors.options && (
              <p className="text-sm text-red-500">{errors.options}</p>
            )}

            <div className="space-y-3">
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {/* label input */}
                  <Input
                    value={opt.label}
                    onChange={(e) => handleLabelChange(idx, e.target.value)}
                    placeholder={`Label ${idx + 1}`}
                    className={errors.options ? "border-red-500" : ""}
                  />

                  {/* icon preview + upload */}
                  {opt.icon ? (
                    <img
                      src={opt.icon}
                      alt="icon"
                      className="h-8 w-8 rounded object-contain border"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded border flex items-center justify-center text-xs text-muted">
                      ?
                    </div>
                  )}

                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleIconUpload(idx, e.target.files[0])
                      }
                      disabled={isUploading}
                    />
                    <UploadCloud className="h-5 w-5" />
                  </label>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(idx)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading…" : "Save Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
