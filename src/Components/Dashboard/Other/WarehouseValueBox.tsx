import axios from "axios";
import { useEffect, useState } from "react";
import { Spinner } from "@nextui-org/react";

export default function WarehouseValueBox() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [warehouseValue, setWarehouseValue] =
    useState<string>("Non disponibile");

  useEffect(() => {
    fetchWarehouseValue();
  }, []);

  async function fetchWarehouseValue() {
    try {
      setIsLoading(true);
      const res = await axios.get("/Products/GET/GetWarehouseValue");
      if (res.status === 200) {
        const { TotalValue } = res.data;
        setWarehouseValue(
          TotalValue !== null && TotalValue !== undefined
            ? `€ ${Number(TotalValue).toLocaleString("it-IT", {
                minimumFractionDigits: 2,
              })}`
            : "Non disponibile"
        );
      } else {
        // Gestione risposta non valida
        setWarehouseValue("Non disponibile");
      }
    } catch (error) {
      console.error("Errore nel prelevare il valore del magazzino: ", error);
      setWarehouseValue("Non disponibile");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="border-2 rounded-lg">
      <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow-sm sm:p-6">
        <div className="truncate text-sm font-medium text-gray-500">
          Valore del magazzino
        </div>
        <div className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
          {isLoading ? <Spinner size="sm" /> : warehouseValue}
        </div>
      </div>
    </div>
  );
}
