[![best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bongekanjing/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bongekanjing/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/c/best-spot-the-difference-game-20261121-0451)

# Gull Cove — Spot the Difference

A complete spot-the-difference game for the [best spot the difference game bounty](https://make.fun/c/best-spot-the-difference-game-20261121-0451). Two near-identical pictures side by side, eight differences a round, three rounds, three minutes a round.

## The game

- **Round 1 · Dusk at Gull Cove** — lighthouse, cottage, boat, one sleepy cat.
- **Round 2 · The Night Market** — lanterns, jars, bunting and a patient cat.
- **Round 3 · Observatory Hill** — dome, pines, campfire and an owl on watch.

Click a difference on either panel to ring it on both (100 points a find). A wrong click just flashes red. Three hints a round (button or **H**) pulse a circle around one unfound difference. **R** retries the round, **M** toggles the sounds (small WebAudio pops and chimes, generated in code — no audio files). Finish a round with time to spare for a time bonus.

## How it is built

Pure static files, no network, no library: `game/index.html` plus a stylesheet and four ES modules with one clear job each — `src/art.js` (shared canvas drawing helpers), `src/scenes.js` (the three scenes and their difference tables), `src/game.js` (rules, timer, hints, score, sounds), `src/main.js` (boot and the render loop). Every scene is drawn twice by the same code, once per panel, with a `variant` flag flipping each difference to its B state, so the panels are identical except for the differences themselves.

## Play it

```sh
node serve.ts   # serves game/ at http://localhost:8080
```

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `game/` and `screenshots/` to the output and writes `dossier.json` with the vendored make.fun library.

## Referral

Built with [make.fun](https://make.fun/r/204hjvsp).
