import React, { useEffect, useState } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import { Spinner } from "@nextui-org/react";

// Interfacce
interface CategoryCount {
  CategoryName: string;
  Count: number;  // Ora rappresenta la somma di ProductAmount
}

interface ChartData {
  series: number[];
  options: any;
}

// Funzione per generare colori
const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  const saturation = 70;
  const lightness = 55 + (hash % 20);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const ProductDistributionChart: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData>({ series: [], options: {} });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Funzione per calcolare le percentuali
  const calculatePercentages = (data: CategoryCount[]): number[] => {
    const total = data.reduce((sum, item) => sum + item.Count, 0);
    console.log(`Totale pezzi in magazzino: ${total}`);
    
    return data.map(item => {
      const percentage = (item.Count / total) * 100;
      console.log(`${item.CategoryName}: ${item.Count} pezzi, ${percentage.toFixed(1)}%`);
      return Number(percentage.toFixed(1));
    });
  };

  const fetchProductDistribution = async () => {
    try {
      const response = await axios.get<CategoryCount[]>("/Products/GET/GetCategoryStats");
      const data = Array.isArray(response.data) ? response.data : [response.data];
      
      console.log("Dati ricevuti dal server:", data);

      if (data && data.length > 0) {
        const categories = data.map(item => item.CategoryName);
        const percentages = calculatePercentages(data);
        const categoryColors = categories.map(category => stringToColor(category));

        console.log("Categorie:", categories);
        console.log("Percentuali calcolate:", percentages);

        setChartData({
          series: percentages,
          options: {
            chart: {
              type: "pie",
              animations: {
                enabled: true,
                easing: "easeinout",
                speed: 1000,
              },
            },
            labels: categories,
            colors: categoryColors,
            dataLabels: {
              enabled: true,
              formatter: function(val: number) {
                return val.toFixed(1) + '%';
              },
              style: {
                fontSize: "12px",
                fontWeight: "bold",
                colors: ["#fff"],
              },
            },
            tooltip: {
              y: {
                formatter: function(val: number) {
                  return val.toFixed(1) + '%';
                },
              },
            },
            legend: {
              position: "right",
              floating: false,
              fontSize: "14px",
              labels: {
                colors: "#333",
              },
              itemMargin: {
                horizontal: 10,
                vertical: 5,
              },
              formatter: function(seriesName: string, opts: any) {
                const count = data[opts.seriesIndex].Count;
                const percentage = opts.w.globals.series[opts.seriesIndex];
                return `${seriesName} (${percentage.toFixed(1)}%)`;
              },
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: "100%",
                  },
                  legend: {
                    position: "bottom",
                  },
                },
              },
            ],
          },
        });
      } else {
        setError("Dati insufficienti o non disponibili.");
      }
    } catch (error) {
      console.error("Errore nel recuperare i dati:", error);
      setError("Errore nel recuperare i dati.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDistribution();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-5 border-2 rounded-lg bg-white">
        <Spinner size="sm" />
        <span className="ml-2">Caricamento dei dati...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-5 border-2 rounded-lg bg-white">
      <div className="w-full max-w-2xl">
        <h2 className="text-lg font-semibold text-center mb-6">
          Distribuzione dei Pezzi in Magazzino per Categoria
        </h2>
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <ApexCharts
            options={chartData.options}
            series={chartData.series}
            type="pie"
            height={350}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDistributionChart;

