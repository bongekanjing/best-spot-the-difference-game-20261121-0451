# Twin Tales — Spot the Difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bongekanjing/best-spot-the-difference-game-20261121-0451/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/bongekanjing/best-spot-the-difference-game-20261121-0451/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

Repository: [bongekanjing/best-spot-the-difference-game-20261121-0451](https://github.com/bongekanjing/best-spot-the-difference-game-20261121-0451)

An entry for the [make.fun bounty "Make the best spot the difference game"](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451) — a complete, original spot-the-difference game that runs from static files in a desktop browser, no network needed.

## The game

Two near-identical pictures sit side by side. They look the same — they are not. Click every difference on either picture; a gold ring and check mark it on both panels, and the counter counts down what is still hiding.

Three original, procedurally drawn scenes, each harder than the last:

1. **Morning Garden** — 5 differences, 2:00 on the clock
2. **Harbour at Dusk** — 7 differences, 2:30 on the clock
3. **Night Market** — 9 differences, 3:00 on the clock

Fair but not obvious: a sail that changed colour, a gull that never came home, a cat that slipped off its crate, a moon that changed phase. A hint button (3 per round, H key) pulses a blue ring around a difference you have missed. A wrong click costs 10 points. Clearing a round banks a time bonus; finding all 21 differences wins the game.

## Play

Serve `game/` with any static server and open `game/index.html` in desktop Chrome:

```
node serve.ts   # serves game/ at http://localhost:8080
```

- **Mouse:** click a difference on either picture
- **H:** hint · **P:** pause · **N:** next round · **R:** restart · **Space / Enter:** start

No build step, no libraries, no network requests. Every scene is drawn on canvas from code; every sound is synthesised WebAudio. Best score is kept in local storage.

## Layout

```
game/
  index.html        the page: a 1280x800 canvas, nothing else
  src/
    config.js       layout, tuning, scoring
    random.js       seeded RNG (identical scenes, both panels)
    scenes.js       the three pictures and their 21 differences
    world.js        rules: clicks, hints, timer, scoring (no drawing)
    render.js       header, panels, markers, footer, overlays (no rules)
    audio.js        synthesised WebAudio sounds
    input.js        mouse + keyboard, mapped to logical coordinates
    shots.js        screenshot autopilots (?shot=start|play|round2|win)
    main.js         boot + fixed 1/60 s step loop
```

Screenshots are real renders of the game's own code: `?shot=play` and friends stage real game states through the world's own click path, frozen for the camera.

## Hand-in

`main.ts` (Node 22, standard library only) copies `game/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the kit's vendored `vendor/makefun-game.ts`:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
