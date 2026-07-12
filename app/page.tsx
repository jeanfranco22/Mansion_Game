import { Game } from "@/src/game/Game";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const debug = params.debug === "true";

  return <Game debug={debug} />;
}
