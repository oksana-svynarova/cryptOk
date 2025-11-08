import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import "./CoinChart.css"

function CoinChart({ coinId }) {
  const [chartData, setChartData] = useState([]);
  const [days, setDays] = useState(7);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const symbol = coinId.toUpperCase();
      const localKey = `ohlc_${symbol}_${days}`;
      const cached = localStorage.getItem(localKey);
      let data;

      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < 10 * 60 * 1000) {
          data = parsed.data;
          console.log("Using cached data");
        }
      }

      if (!data) {
        console.log("Fetching data from CryptoCompare API...");
        setIsLoading(true);
        const limit = days - 1;
        const url = `https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=${limit}`;

        try {
          const res = await fetch(url);
          if (!res.ok) {
            console.error(`API fetch failed with status: ${res.status}`);
            setChartData([]);
            setIsLoading(false);
            return;
          }
          const apiData = await res.json();

          if (!apiData?.Data?.Data || !Array.isArray(apiData.Data.Data)) {
            console.error("Expected OHLC array, got:", apiData);
            setChartData([]);
            setIsLoading(false);
            return;
          }

          data = apiData.Data.Data.map(item => ({
            time: item.time,
            open: item.open,
            high: item.high,
            low: item.low,
            close: item.close,
          }));

          localStorage.setItem(localKey, JSON.stringify({ timestamp: Date.now(), data }));
        } catch (error) {
          console.error("Network or parsing error:", error);
          setChartData([]);
          setIsLoading(false);
          return;
        }
      }

      setChartData(data);
      setIsLoading(false);
    }

    fetchData();
  }, [coinId, days]);

  const handleDaysChange = newDays => {
    setDays(newDays);
  };

  if (isLoading) return <div className="chart-loading">Loading chart...</div>;
  if (!chartData || chartData.length === 0)
  return <div className="chart-error">No data available for this coin.</div>;

  const series = [
    {
      data: chartData.map(item => ({
        x: new Date(item.time * 1000),
        y: [item.open, item.high, item.low, item.close]
      }))
    }
  ];

  const options = {
    chart: {
      type: "candlestick",
      height: 400,
      background: "var(--color-bg)",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: { enabled: true, easing: "easeinout", speed: 800 },
    },
    plotOptions: {
      candlestick: {
        colors: { upward: "var(--text-color-rising)", downward: "var(--text-color-falling)" },
        wick: { useFillColor: true },
        barHeight: "50%",
        borderRadius: 2,
      }
    },
    xaxis: {
      type: "datetime",
      labels: { style: { colors: "var(--text-color-main)" } }
    },
    yaxis: {
      tooltip: { enabled: true },
    },
    tooltip: {
      theme: "dark",
      y: {
        formatter: val => `O: ${val[0]}, H: ${val[1]}, L: ${val[2]}, C: ${val[3]}`
      }
    },
  };

  return (
    <div className="chart-container">
      <div className="btn-days-wrapper">
        {[7, 30, 90, 180, 365].map(d => (
          <button
            key={d}
            onClick={() => handleDaysChange(d)}
            className={`btn-days ${
              days === d ? "active" : " "}`}
          >
            {d === 7 ? "7D" : `${d}D`}
          </button>
        ))}
      </div>
      <Chart options={options} series={series} type="candlestick" height={400} />
    </div>
  )
}

export default CoinChart;