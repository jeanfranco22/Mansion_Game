export type InteractionConfig = {
  prompt: string | (() => string | null);
  enabled?: () => boolean;
  onInteract: () => void;
};

const interactions = new Map<string, InteractionConfig>();

export function registerInteraction(id: string, config: InteractionConfig) {
  interactions.set(id, config);

  return () => {
    interactions.delete(id);
  };
}

export function getInteraction(id: string) {
  return interactions.get(id) ?? null;
}

export function getInteractionPrompt(config: InteractionConfig) {
  return typeof config.prompt === "function" ? config.prompt() : config.prompt;
}
