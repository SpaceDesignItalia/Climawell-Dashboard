"use client";

import { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import axios from "axios";

interface CategoryCount {
  CategoryName: string;
  Count: number;
}

interface ChartData {
  series: number[];
  labels: string[];
  colors: string[];
}

// Generate visually pleasing colors using HSL
const generateChartColors = (count: number): string[] => {
  return Array.from({ length: count }, (_, i) => {
    const hue = (i * 360) / count;
    return `hsl(${hue}, 70%, 50%)`;
  });
};

export default function ProductDistributionChart() {
  const [chartData, setChartData] = useState<ChartData>({
    series: [],
    labels: [],
    colors: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processData = (data: CategoryCount[]) => {
    const total = data.reduce((sum, item) => sum + item.Count, 0);
    const sortedData = [...data].sort((a, b) => b.Count - a.Count);

    const processedData = {
      series: [] as number[],
      labels: [] as string[],
    };

    // Process top categories (>= 2%)
    let othersSum = 0;
    sortedData.forEach((item) => {
      const percentage = (item.Count / total) * 100;
      if (processedData.series.length < 9 && percentage >= 2) {
        processedData.series.push(Number(percentage.toFixed(1)));
        processedData.labels.push(item.CategoryName);
      } else {
        othersSum += percentage;
      }
    });

    // Add "Others" category if exists
    if (othersSum > 0) {
      processedData.series.push(Number(othersSum.toFixed(1)));
      processedData.labels.push("Altre categorie");
    }

    return {
      ...processedData,
      colors: generateChartColors(processedData.labels.length),
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<CategoryCount[]>(
          "/Products/GET/GetCategoryStats"
        );
        const data = Array.isArray(response.data)
          ? response.data
          : [response.data];

        if (!data?.length) {
          throw new Error("Nessun dato disponibile");
        }

        setChartData(processData(data));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Errore nel caricamento dei dati"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getChartOptions = () => ({
    chart: {
      type: "donut" as const,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      fontFamily: "inherit",
      background: "transparent",
    },
    colors: chartData.colors,
    labels: chartData.labels,
    legend: {
      position: "bottom" as const,
      fontSize: "14px",
      markers: {
        size: 3,
      },
      formatter: (seriesName: string, opts: any) => {
        const percentage = opts.w.globals.series[opts.seriesIndex];
        return `${seriesName} (${percentage}%)`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "16px",
              fontWeight: 600,
            },
            value: {
              show: true,
              fontSize: "14px",
              formatter: (val: string) => `${val}%`,
            },
            total: {
              show: true,
              label: "Totale",
              formatter: () => "100%",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      y: {
        formatter: (val: number) => `${val}%`,
      },
    },
    stroke: {
      width: 2,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  if (isLoading) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
            <p className="text-sm text-gray-500">Caricamento dati...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Distribuzione Prodotti per Categoria
          </h2>
        </div>
        <div className="h-[400px] w-full">
          {chartData.series.length > 0 && (
            <ApexCharts
              options={getChartOptions()}
              series={chartData.series}
              type="donut"
              height="100%"
            />
          )}
        </div>
      </div>
    </div>
  );
}
