import { useEffect, useState } from "react";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import axios from "axios";
import { Spinner } from "@heroui/react";

export default function StatsBox() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statsData, setStatsData] = useState({
    TotalProducts: "Non disponibile",
    TotalCategories: "Non disponibile",
    TotalPieces: "Non disponibile",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setIsLoading(true);
      const res = await axios.get("/Products/GET/GetWarehouseStats");
      if (res.status === 200) {
        const { TotalProducts, TotalCategories, TotalPieces } = res.data;
        setStatsData({
          TotalProducts: TotalProducts || "Non disponibile",
          TotalCategories: TotalCategories || "Non disponibile",
          TotalPieces: TotalPieces || "Non disponibile",
        });
      } else {
        // In caso di risposta non valida
        setStatsData({
          TotalProducts: "Non disponibile",
          TotalCategories: "Non disponibile",
          TotalPieces: "Non disponibile",
        });
      }
    } catch (error) {
      console.error("Errore nel prelevare le statistiche: ", error);
      setStatsData({
        TotalProducts: "Non disponibile",
        TotalCategories: "Non disponibile",
        TotalPieces: "Non disponibile",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const stats = [
    {
      id: 1,
      name: "Prodotti",
      stat: statsData.TotalProducts,
      icon: StorefrontOutlinedIcon,
    },
    {
      id: 2,
      name: "Categorie",
      stat: statsData.TotalCategories,
      icon: FormatListBulletedOutlinedIcon,
    },
    {
      id: 3,
      name: "Stock Totali",
      stat: statsData.TotalPieces,
      icon: Inventory2OutlinedIcon,
    },
  ];

  return (
    <div>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-lg bg-white p-5 shadow-sm sm:px-6 sm:pt-6 border-2"
          >
            <dt>
              <div className="absolute rounded-md bg-primary p-3">
                <item.icon aria-hidden="true" className="size-6 text-white" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline">
              {isLoading ? (
                <Spinner size="sm" className="mt-2" />
              ) : (
                <p className="text-2xl font-semibold text-gray-900">
                  {item.stat}
                </p>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
