// Start beide versies naast elkaar: versie 1 op http://localhost:4321, versie 2 op http://localhost:4322.
// Met het knopje rechtsboven (alleen lokaal) wissel je op dezelfde pagina van versie.
// Stopt een van de twee, of druk je op Ctrl+C, dan stopt de ander ook: er blijft nooit een server
// op de achtergrond doordraaien.
import { spawn } from 'node:child_process';

const servers = [
  { versie: '1', poort: '4321' },
  { versie: '2', poort: '4322' },
].map(({ versie, poort }) =>
  spawn('npx', ['astro', 'dev', '--port', poort], { stdio: 'inherit', env: { ...process.env, VERSIE: versie } }),
);

const stop = (code = 0) => {
  for (const s of servers) if (s.exitCode === null) s.kill('SIGTERM');
  process.exit(code);
};
for (const s of servers) s.on('exit', (code) => stop(code ?? 0));
for (const sig of ['SIGINT', 'SIGTERM', 'SIGHUP']) process.on(sig, () => stop(0));
