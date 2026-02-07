import { Lightbulb } from 'lucide-react';

const examples = [
  { text: "Add buy milk to my list", highlight: "Add buy milk to my list" },
  { text: "Show me my tasks", highlight: "Show me my tasks" },
  { text: "Mark task 1 as complete", highlight: "Mark task 1 as complete" },
  { text: "Delete task 2", highlight: "Delete task 2" },
];

export default function QuickExamples() {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <Lightbulb className="w-4 h-4 text-primary" />
        Quick Examples
      </h3>
      <div className="space-y-2">
        {examples.map((example, index) => (
          <div
            key={index}
            className="p-3 bg-secondary/50 rounded-lg border border-border/30 hover:border-primary/30 transition-colors duration-200 cursor-pointer group"
          >
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              "<span className="text-primary">{example.highlight}</span>"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
