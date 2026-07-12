import { useEffect } from "react";
import {
  registerInteraction,
  type InteractionConfig,
} from "./interactionRegistry";

export function useRegisterInteraction(id: string, config: InteractionConfig) {
  useEffect(() => registerInteraction(id, config), [id, config]);
}
