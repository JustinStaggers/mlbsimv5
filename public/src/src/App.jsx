import React, { useState } from "react";

const teams = ["Yankees", "Red Sox", "Dodgers", "Braves"];

const environmentData = {
  Yankees: { parkFactor: 1.03, wind: 10, temperature: 75, odds: { open: -130, current: -140 } },
  RedSox: { parkFactor: 1.08, wind: 8, temperature: 72, odds: { open: +110, current: +125 } },
  Dodgers: { parkFactor: 1.05, wind: 5, temperature: 77, odds: { open: -145, current: -150 } },
  Braves: { parkFactor: 1.02, wind: 12, temperature: 80, odds: { open: -120, current: -115 } },
};

const getLineMovement = (open, current) => {
  if (current > open) return { direction: "up", diff: current - open };
  if (current < open) return { direction: "down", diff: open - current };
  return { direction: "neutral", diff: 0 };
};

export default function App() {
  const [homeTeam, setHomeTeam] = useState("Yankees");
  const [awayTeam, setAwayTeam] = useState("RedSox");
  const [results, setResults] = useState(null);
  const [bulkResults, setBulkResults] = useState([]);

  const simulateScore = (env) => {
    const base = 3 + Math.random() * 3;
    const power = 0.8;
    const contact = 1.2;
    const pitcherEffect = 1.0;
    const weatherEffect = (env.wind / 10) + ((env.temperature - 65) / 20);
    const parkEffect = env.parkFactor;
    return Math.round(base + power + contact + pitcherEffect + weatherEffect + parkEffect + (Math.random() - 0.5));
  };

  const simulateGame = () => {
    const home = environmentData[homeTeam];
    const away = environmentData[awayTeam];
    const homeScore = simulateScore(home);
    const awayScore = simulateScore(away);
    setResults({ homeScore, awayScore });
  };

  const simulateAllGames = () => {
    const simulations = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = 0; j < teams.length; j++) {
        if (i !== j) {
          const homeTeam = teams[i];
          const awayTeam = teams[j];
          const home = environmentData[homeTeam];
          const away = environmentData[awayTeam];
          const homeScore = simulateScore(home);
          const awayScore = simulateScore(away);
          simulations.push({ homeTeam, awayTeam, homeScore, awayScore });
        }
      }
    }
    setBulkResults(simulations);
  };

  const renderOddsMovement = (team) => {
    const odds = environmentData[team].odds;
    const movement = getLineMovement(odds.open, odds.current);
    const arrow = movement.direction === "up" ? "▲" : movement.direction === "down" ? "▼" : "→";
    const color = movement.direction === "up" ? "red" : movement.direction === "down" ? "green" : "gray";
    return (
      <p style={{ color }}>{team} Odds: {odds.open} {arrow} {odds.current}</p>
    );
  };

  return (
    <main style={{ padding: "1rem", fontFamily: "sans-serif" }}>
      <h1>MLB Game Simulator</h1>

      <div style={{ display: "flex", gap: "1rem" }}>
        <div>
          <label>Home Team</label>
          <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)}>
            {teams.map((team) => <option key={team}>{team}</option>)}
          </select>
        </div>
        <div>
          <label>Away Team</label>
          <select value={awayTeam
