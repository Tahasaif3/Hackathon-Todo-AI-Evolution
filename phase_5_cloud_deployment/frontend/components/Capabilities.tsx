import { Check, Zap } from 'lucide-react';

const capabilities = [
  "Create new tasks",
  "View your task list",
  "Mark tasks as complete",
  "Update task details",
  "Delete tasks",
  "Set priorities",
];

export default function Capabilities() {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-accent rounded-full" />
        <Zap className="w-4 h-4 text-accent" />
        Capabilities
      </h3>
      <ul className="space-y-2.5">
        {capabilities.map((capability, index) => (
          <li 
            key={index} 
            className="flex items-center gap-2.5 text-sm text-muted-foreground animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="w-5 h-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
              <Check className="w-3 h-3 text-green-500" />
            </div>
            <span>{capability}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
