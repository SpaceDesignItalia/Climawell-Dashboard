import React, { useEffect, useState } from "react";
import axios from "axios";
import ApexCharts from "react-apexcharts";
import { Spinner } from "@heroui/react";

const WarehouseValueChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({ series: [], options: {} });
  const [isLoading, setIsLoading] = useState<boolean>(true); // Stato per il caricamento
  const [noData, setNoData] = useState<boolean>(false); // Stato per gestire i dati insufficienti

  // Funzione per recuperare i dati di media mensile dal backend
  useEffect(() => {
    fetchMonthlyAverage();
  }, []);

  const fetchMonthlyAverage = async () => {
    try {
      setIsLoading(true); // Imposta il caricamento su true quando inizia la richiesta
      const response = await axios.get("Products/GET/GetWarehouseValueYear"); // Percorso API backend per ottenere la media mensile
      const monthlyData = response.data;

      if (!monthlyData || monthlyData.length === 0) {
        setNoData(true); // Imposta noData a true se non ci sono dati
        setIsLoading(false);
        return;
      }

      // Organizzare i dati in base a ciò che ApexCharts richiede
      const months = monthlyData.map((item: any) => {
        // Trasformiamo i mesi numerici in nomi dei mesi
        const date = new Date(2023, item.month - 1, 1);
        return date.toLocaleString("default", { month: "long" }); // Nome del mese
      });

      const values = monthlyData.map((item: any) => item.monthly_avg);

      // Funzione per formattare i numeri come valuta
      const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 2,
        }).format(value);
      };

      // Aggiorna lo stato con i nuovi dati formattati
      setChartData({
        series: [
          {
            name: "Valore di Magazzino", // Nome della serie
            data: values,
          },
        ],
        options: {
          chart: {
            type: "area", // Tipo di grafico ad area
            zoom: { enabled: false },
          },
          dataLabels: {
            enabled: true, // Abilita le etichette sui dati
            formatter: (val: number) => formatCurrency(val), // Formattiamo il valore
          },
          stroke: {
            curve: "smooth", // Linea liscia
            width: 2, // Larghezza della linea
          },
          tooltip: {
            x: { format: "dd MMM" },
            y: {
              formatter: (val: number) => formatCurrency(val), // Formattazione del tooltip
            },
          },
          xaxis: {
            categories: months, // Mesi come categorie
            title: { text: "Mese" },
          },
          yaxis: {
            title: { text: "Valore (€)" },
            labels: {
              formatter: (value: number) => formatCurrency(value), // Formattiamo l'asse Y
            },
          },
          fill: {
            opacity: 0.5, // Opacità dell'area sotto la linea
          },
        },
      });
    } catch (error) {
      console.error(
        "Errore nel recuperare la media mensile del magazzino",
        error
      );
      setNoData(true); // Imposta noData a true in caso di errore
    } finally {
      setIsLoading(false); // Imposta il caricamento su false dopo aver completato
    }
  };

  return (
    <div className="flex justify-center items-center p-5 border-2 rounded-lg bg-white h-full">
      <div className="w-full max-w-2xl">
        <h2 className="text-lg font-semibold text-center mb-6">
          Valore medio del Magazzino nel Tempo
        </h2>

        {isLoading ? (
          <div className="flex justify-center items-center">
            {/* Spinner di caricamento */}
            <Spinner size="sm" />
          </div>
        ) : noData ? (
          <div className="text-center">Dati Insufficienti</div>
        ) : (
          <ApexCharts
            options={chartData.options}
            series={chartData.series}
            type="area" // Tipo di grafico ad area
            height={350}
          />
        )}
      </div>
    </div>
  );
};

export default WarehouseValueChart;
