import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState([{ stat: 0 }, { stat: 0 }]);

  function fetchStats() {
    Promise.all([axios.get("/Products/GET/GetAllProducts")]).then((res) => {
      setStats([{ stat: res[0].data.length }]);
    });
  }

  useEffect(() => {
    fetchStats();
  }, []);

  const statistics = [
    {
      id: 1,
      name: "Prodotti Totali",
      stat: stats[0]?.stat,
      icon: StorefrontOutlinedIcon,
    },
  ];

  return (
    <div className="py-10 m-0 lg:ml-72">
      <header>
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main className="px-4 sm:px-6 lg:px-8">
        <div className="py-6 lg:py-8">
          <div>
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {statistics.map((item) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 sm:px-6 sm:pt-6 border border-gray"
                >
                  <dt>
                    <div className="absolute rounded-md bg-primary p-3">
                      <item.icon
                        aria-hidden="true"
                        className="h-6 w-6 text-white"
                      />
                    </div>
                    <p className="ml-16 truncate text-sm font-medium text-gray-500">
                      {item.name}
                    </p>
                  </dt>
                  <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                    <p className="text-lg md:text-2xl font-semibold text-gray-900">
                      {item.stat !== 0 ? item.stat : "Dati non disponibili"}
                    </p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="py-6 lg:py-8"></div>
      </main>
    </div>
  );
}
