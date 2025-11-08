import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function CryptoPie() {
  const [data, setData] = useState([]);

  useEffect(() => {
  async function fetchData() {
    try {
      const globalRes = await fetch("https://api.coinpaprika.com/v1/global");
      const globalJson = await globalRes.json();

      const totalMC = globalJson.market_cap_usd;
      const btcDominance = Number(globalJson.bitcoin_dominance_percentage.toFixed(2));

      const ethRes = await fetch("https://api.coinpaprika.com/v1/tickers/eth-ethereum");
      const ethJson = await ethRes.json();

      const ethMC = ethJson.quotes.USD.market_cap;
      const ethDominance = Number(((ethMC / totalMC) * 100).toFixed(2));

      const others = Number((100 - btcDominance - ethDominance).toFixed(2));

      setData([
        { name: "Bitcoin", value: btcDominance },
        { name: "Ethereum", value: ethDominance },
        { name: "Others", value: others }
      ]);
    } catch (error) {
      console.error("Dominance fetch error:", error);
    }
  }

  fetchData();
}, []);

  if (data.length === 0) {
    return <div className="schema">Loading...</div>;
  }

  return (
    <div className="schema">
      <h3
        style={{
          color: "var(--text-color-main)",
          fontSize: "18px",
          marginBottom: "15px",
          textAlign: "center"
        }}
      >
        Market Dominance
      </h3>

            <ResponsiveContainer width="100%" height={260}>
        <PieChart>

          <defs>
            <radialGradient id="grad1" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="var(--color-chart1)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-chart1)" stopOpacity="0.6" />
            </radialGradient>

            <radialGradient id="grad2" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="var(--color-chart2)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-chart2)" stopOpacity="0.6" />
            </radialGradient>

            <radialGradient id="grad3" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="var(--color-chart3)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-chart3)" stopOpacity="0.6" />
            </radialGradient>
          </defs>

          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={90}
            dataKey="value"
            stroke="none"
            paddingAngle={2}
            label={({ value }) => `${value.toFixed(1)}%`}
            labelLine={false}
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-out"
            style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.25))" }}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={`url(#grad${index + 1})`} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              background: "var(--color-bg)",
              border: "none",
              borderRadius: "12px",
              padding: "10px 14px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            }}
            labelStyle={{ color: "var(--text-color-main)", fontWeight: 600 }}
            itemStyle={{ color: "var(--text-color-main)" }}
          />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}