import ProductDistributionChart from "../../Components/Dashboard/Other/ProductDistributionChart";
import StatsBox from "../../Components/Dashboard/Other/StatsBox";
import WarehouseValueBox from "../../Components/Dashboard/Other/WarehouseValueBox";
import WarehouseValueChart from "../../Components/Dashboard/Other/WarehouseValueChart";

export default function Dashboard() {
  return (
    <div className="py-10 m-0 lg:ml-72">
      <header>
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main className="px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
        <div>
          <StatsBox />
        </div>
        <div className="grid grid-cols-6 gap-5 h-fit">
          <div className="col-span-6 md:col-span-3 lg:col-span-4">
            <WarehouseValueChart />
          </div>
          <div className="col-span-6 md:col-span-3 lg:col-span-2 flex flex-col gap-5">
            <WarehouseValueBox />
            <ProductDistributionChart />
          </div>
        </div>
      </main>
    </div>
  );
}
