import React from "react";
import ProductTable from "../../Components/Layout/Products/Table/ProductTable";

export default function ProductPage() {
  return (
    <div className="py-10 m-0 lg:ml-72">
      <header>
        <div className="px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Prodotti
          </h1>
        </div>
      </header>
      <main className="px-4 sm:px-6 lg:px-8">
        <div className="py-6 lg:py-8">
          <ProductTable />
        </div>
        <div className="py-6 lg:py-8"></div>
      </main>
    </div>
  );
}
