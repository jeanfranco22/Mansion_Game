import { playGameSound } from "../audio/gameAudio";
import { wait } from "./wait";

type StudyRoomEventActions = {
  closeDoor: () => void;
  setDoorLocked: (locked: boolean) => void;
  setLightIntensity: (intensity: number) => void;
  complete: () => void;
};

export async function runStudyRoomEvent(actions: StudyRoomEventActions) {
  actions.closeDoor();
  actions.setDoorLocked(true);
  playGameSound("lightFlicker", 0.45);

  for (let i = 0; i < 6; i += 1) {
    actions.setLightIntensity(i % 2 === 0 ? 0.08 : 1.15);
    await wait(120);
  }

  actions.setLightIntensity(0);
  await wait(2000);
  playGameSound("distantImpact", 0.7);
  await wait(420);
  actions.setLightIntensity(0.32);
  actions.setDoorLocked(false);
  actions.complete();
}
