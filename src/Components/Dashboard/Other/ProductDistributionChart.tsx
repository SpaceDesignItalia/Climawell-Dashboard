import React, { useEffect, useState } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import { Spinner } from "@heroui/react";

// Interfacce
interface CategoryCount {
  CategoryName: string;
  Count: number;
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Stato per gestire la modale

  // Funzione per calcolare le percentuali e raggruppare le categorie minori
  const calculatePercentagesAndGroup = (data: CategoryCount[]): { percentages: number[]; categories: string[] } => {
    const total = data.reduce((sum, item) => sum + item.Count, 0);

    const percentages: number[] = [];
    const categories: string[] = [];
    let otherPercentage = 0;

    data
      .sort((a, b) => b.Count - a.Count) // Ordina per quantità decrescente
      .forEach((item) => {
        const percentage = (item.Count / total) * 100;
        if (percentages.length < 10 && percentage >= 2) {
          percentages.push(Number(percentage.toFixed(1)));
          categories.push(item.CategoryName);
        } else {
          otherPercentage += percentage;
        }
      });

    if (otherPercentage > 0) {
      percentages.push(Number(otherPercentage.toFixed(1)));
      categories.push("Altre categorie");
    }

    return { percentages, categories };
  };

  const fetchProductDistribution = async () => {
    try {
      const response = await axios.get<CategoryCount[]>("/Products/GET/GetCategoryStats");
      const data = Array.isArray(response.data) ? response.data : [response.data];

      if (data && data.length > 0) {
        const { percentages, categories } = calculatePercentagesAndGroup(data);
        const categoryColors = categories.map((category) => stringToColor(category));

        setChartData({
          series: percentages,
          options: {
            chart: {
              type: "donut",
              animations: {
                enabled: true,
                easing: "easeinout",
                speed: 800,
              },
              toolbar: {
                show: false,
              },
            },
            labels: categories,
            colors: categoryColors,
            dataLabels: {
              enabled: true,
              formatter: (val: number, opts: any) => {
                const name = opts.w.globals.labels[opts.seriesIndex];
                return name.length > 10 ? name.slice(0, 10) + "..." : name;
              },
              style: {
                fontSize: "14px",
                fontWeight: "bold",
                colors: ["#000"],
              },
            },
            tooltip: {
              y: {
                formatter: (val: number) => val.toFixed(1) + "%",
              },
            },
            legend: {
              position: "bottom",
              fontSize: "12px",
              labels: {
                colors: "#333",
              },
              formatter: (seriesName: string, opts: any) => {
                const percentage = opts.w.globals.series[opts.seriesIndex];
                return `${seriesName} (${percentage.toFixed(1)}%)`;
              },
            },
            responsive: [
              {
                breakpoint: 768,
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
      <div className="flex justify-center items-center p-5 border-2 rounded-lg bg-gray-100">
        <Spinner size="sm" />
        <span className="ml-2 text-gray-700">Caricamento dei dati...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center p-5 border-2 rounded-lg">
      <div className="w-full max-w-3xl">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          Distribuzione dei Pezzi in Magazzino per Categoria
        </h2>
        {error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <>
            {/* Preview del grafico */}
            <div className="border border-gray-300 rounded-lg p-4 shadow-md bg-white">
              <ApexCharts options={chartData.options} series={chartData.series} type="donut" height={300} />
            </div>

            {/* Pulsante per aprire la modale */}
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105"
                onClick={() => setIsModalOpen(true)}
              >
                Apri Grafico a Schermo Intero
              </button>
            </div>

            {/* Modale */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
                <div className="bg-white rounded-lg shadow-2xl w-11/12 max-w-5xl p-6 relative">
                  <button
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full h-10 w-10 flex items-center justify-center text-xl"
                    onClick={() => setIsModalOpen(false)}
                  >
                    &times;
                  </button>
                  <ApexCharts options={chartData.options} series={chartData.series} type="donut" height={600} />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDistributionChart;
