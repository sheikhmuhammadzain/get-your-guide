import AiAssistant from "@/components/AiAssistant";
import PageScaffold from "@/components/PageScaffold";

export default function AssistantPage() {
  return (
    <PageScaffold
      title="AI Travel Assistant"
      description="Ask follow-up questions, adjust your route, and get practical Turkey travel tips."
    >
      <div className="rounded-xl border border-border-default bg-surface-muted p-6">
        <p className="text-sm text-text-body">
          Open the chat button at the bottom-right corner to talk with the assistant.
        </p>
      </div>
      <AiAssistant />
    </PageScaffold>
  );
}
