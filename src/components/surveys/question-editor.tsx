import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import {
  CHOICE_QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
  type QuestionType,
  type SurveyQuestion,
} from "@/types/survey";

interface QuestionEditorProps {
  question: SurveyQuestion;
  index: number;
  total: number;
  onChange: (question: SurveyQuestion) => void;
  onRemove: () => void;
  onMove: (direction: -1 | 1) => void;
}

export function QuestionEditor({
  question,
  index,
  total,
  onChange,
  onRemove,
  onMove,
}: QuestionEditorProps) {
  const supportsOptions = CHOICE_QUESTION_TYPES.includes(question.type);
  const options = question.options ?? [];

  const updateOption = (optionIndex: number, value: string) => {
    const next = [...options];
    next[optionIndex] = value;
    onChange({ ...question, options: next });
  };

  return (
    <Card>
      <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 pb-3">
        <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <GripVertical className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">Question {index + 1}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Move question ${index + 1} up`}
            disabled={index === 0}
            onClick={() => onMove(-1)}
          >
            <ArrowUp className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Move question ${index + 1} down`}
            disabled={index === total - 1}
            onClick={() => onMove(1)}
          >
            <ArrowDown className="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Remove question ${index + 1}`}
            className="text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-[1.6fr_1fr]">
          <div className="space-y-2">
            <Label htmlFor={`${question.id}-title`}>Question title</Label>
            <Input
              id={`${question.id}-title`}
              value={question.title}
              placeholder="What would you like to ask?"
              onChange={(event) => onChange({ ...question, title: event.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${question.id}-type`}>Answer type</Label>
            <Select
              value={question.type}
              onValueChange={(value) =>
                onChange({
                  ...question,
                  type: value as QuestionType,
                  options: CHOICE_QUESTION_TYPES.includes(value as QuestionType)
                    ? (question.options ?? ["Option 1"])
                    : undefined,
                })
              }
            >
              <SelectTrigger id={`${question.id}-type`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(QUESTION_TYPE_LABELS) as QuestionType[]).map((type) => (
                  <SelectItem key={type} value={type}>
                    {QUESTION_TYPE_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {supportsOptions ? (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium text-foreground">Choices</legend>
            {options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <Input
                  value={option}
                  aria-label={`Choice ${optionIndex + 1}`}
                  placeholder={`Option ${optionIndex + 1}`}
                  onChange={(event) => updateOption(optionIndex, event.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove choice ${optionIndex + 1}`}
                  disabled={options.length <= 1}
                  onClick={() =>
                    onChange({
                      ...question,
                      options: options.filter((_, i) => i !== optionIndex),
                    })
                  }
                >
                  <X className="size-4" aria-hidden="true" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onChange({ ...question, options: [...options, `Option ${options.length + 1}`] })
              }
            >
              <Plus className="size-4" aria-hidden="true" />
              Add choice
            </Button>
          </fieldset>
        ) : null}

        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          <Label htmlFor={`${question.id}-required`} className="text-sm font-normal">
            Required question
          </Label>
          <Switch
            id={`${question.id}-required`}
            checked={question.required}
            onCheckedChange={(checked) => onChange({ ...question, required: checked })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
