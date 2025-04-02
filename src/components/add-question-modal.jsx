import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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

export function AddQuestionModal({ isOpen, onClose, onSubmit, initialData }) {
  const [formData, setFormData] = useState({
    text: "",
    questionType: "SINGLE",
    isLive: true,
    options: ["", ""],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        text: initialData.text || "",
        questionType: initialData.questionType || "SINGLE",
        isLive: initialData.isLive ?? true,
        options: initialData.options || ["", ""],
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSwitchChange = (checked) => {
    setFormData({
      ...formData,
      isLive: checked,
    });
  };

  const handleTypeChange = (value) => {
    setFormData({
      ...formData,
      questionType: value,
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;

    setFormData({
      ...formData,
      options: newOptions,
    });

    // Clear options error when any option is edited
    if (errors.options) {
      setErrors({
        ...errors,
        options: null,
      });
    }
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, ""],
    });
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) {
      toast.error("Cannot remove option");

      return;
    }

    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.text.trim()) {
      newErrors.text = "Question text is required";
    }

    const nonEmptyOptions = formData.options.filter((opt) => opt.trim());
    if (nonEmptyOptions.length < 2) {
      newErrors.options = "At least 2 non-empty options are required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    // Filter out empty options
    const cleanedOptions = formData.options.filter((opt) => opt.trim());

    onSubmit({
      ...formData,
      options: cleanedOptions,
    });

    // Reset form
    setFormData({
      text: "",
      questionType: "SINGLE",
      isLive: true,
      options: ["", ""],
    });
    setErrors({});
  };

  const handleClose = () => {
    setFormData({
      text: "",
      questionType: "SINGLE",
      isLive: true,
      options: ["", ""],
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription>
            Create a new survey question with multiple options.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="text" className="text-right">
              Question Text
            </Label>
            <Input
              id="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Enter your question here"
              className={errors.text ? "border-red-500" : ""}
            />
            {errors.text && (
              <p className="text-sm text-red-500">{errors.text}</p>
            )}
          </div>

          {/* Question Type */}
          <div className="space-y-2">
            <Label htmlFor="questionType" className="text-right">
              Question Type
            </Label>
            <Select
              value={formData.questionType}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="questionType">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SINGLE">Single Choice</SelectItem>
                <SelectItem value="MULTIPLE">Multiple Choice</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Is Live */}
          <div className="flex items-center justify-between">
            <Label htmlFor="isLive" className="text-right">
              Make Question Live
            </Label>
            <Switch
              id="isLive"
              checked={formData.isLive}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-right">Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>

            {errors.options && (
              <p className="text-sm text-red-500">{errors.options}</p>
            )}

            <div className="space-y-2">
              {formData.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className={errors.options ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(index)}
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
            <Button type="submit">Save Question</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
