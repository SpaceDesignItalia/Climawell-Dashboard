import React, { useEffect, useState } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import { Spinner } from "@nextui-org/react";

// Funzione per generare un colore esadecimale armonioso e distinto basato sulla stringa
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
  const [chartData, setChartData] = useState<any>({ series: [], options: {} });
  const [loading, setLoading] = useState<boolean>(true); // Stato di caricamento
  const [error, setError] = useState<string | null>(null); // Stato per errore

  useEffect(() => {
    fetchProductDistribution();
  }, []);

  // Funzione per recuperare la distribuzione dei prodotti
  const fetchProductDistribution = async () => {
    try {
      const response = await axios.get("/Products/GET/GetCategoryStats"); // Percorso API backend per ottenere la distribuzione
      let data = response.data;

      console.log("Dati ricevuti:", data); // Aggiungi un log per verificare i dati ricevuti

      // Se i dati sono un singolo oggetto, trasformali in un array
      if (!Array.isArray(data)) {
        data = [data]; // Rende il dato un array anche se è un singolo oggetto
      }

      if (data && data.length > 0) {
        const categories = data.map((item: any) => item.CategoryName);
        const percentages = data.map(
          (item: any) => parseFloat(item.Percentage).toFixed(2) // Arrotonda a 2 decimali
        );

        console.log("Percentuali convertite:", percentages); // Aggiungi un log per verificare le percentuali

        // Genera i colori distinti per ogni categoria
        const categoryColors = categories.map((category: string) =>
          stringToColor(category)
        );

        // Aggiorna i dati del grafico
        setChartData({
          series: percentages.map((percentage: string) =>
            parseFloat(percentage)
          ), // Converte in numero
          options: {
            chart: {
              type: "pie", // Tipo di grafico: pie (torta)
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
              formatter: (val: number) => `${val}%`,
              style: {
                fontSize: "12px",
                fontWeight: "bold",
                colors: ["#fff"],
              },
            },
            tooltip: {
              y: {
                formatter: (val: number) => `${val}%`,
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
      console.error(
        "Errore nel recuperare la distribuzione dei prodotti:",
        error
      );
      setError("Errore nel recuperare i dati.");
    } finally {
      setLoading(false); // Fine del caricamento
    }
  };

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
          Distribuzione dei Prodotti nelle Categorie
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
