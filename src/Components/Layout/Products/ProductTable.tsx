import React from "react";
import { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Input,
} from "@nextui-org/react";
import axios from "axios";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ViewProductModal from "./ViewProductModal";

export const columns = [
  { name: "Id", uid: "id" },
  { name: "Nome", uid: "name" },
  { name: "Descrizione", uid: "description" },
  { name: "Quantità", uid: "quantity" },
  { name: "Azioni", uid: "actions" },
];

export const EyeIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M12.9833 10C12.9833 11.65 11.65 12.9833 10 12.9833C8.35 12.9833 7.01666 11.65 7.01666 10C7.01666 8.35 8.35 7.01666 10 7.01666C11.65 7.01666 12.9833 8.35 12.9833 10Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M9.99999 16.8916C12.9417 16.8916 15.6833 15.1583 17.5917 12.1583C18.3417 10.9833 18.3417 9.00831 17.5917 7.83331C15.6833 4.83331 12.9417 3.09998 9.99999 3.09998C7.05833 3.09998 4.31666 4.83331 2.40833 7.83331C1.65833 9.00831 1.65833 10.9833 2.40833 12.1583C4.31666 15.1583 7.05833 16.8916 9.99999 16.8916Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const DeleteIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M17.5 4.98332C14.725 4.70832 11.9333 4.56665 9.15 4.56665C7.5 4.56665 5.85 4.64998 4.2 4.81665L2.5 4.98332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.08331 4.14169L7.26665 3.05002C7.39998 2.25835 7.49998 1.66669 8.90831 1.66669H11.0916C12.5 1.66669 12.6083 2.29169 12.7333 3.05835L12.9166 4.14169"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M15.7084 7.61664L15.1667 16.0083C15.075 17.3166 15 18.3333 12.675 18.3333H7.32502C5.00002 18.3333 4.92502 17.3166 4.83335 16.0083L4.29169 7.61664"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M8.60834 13.75H11.3833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
      <path
        d="M7.91669 10.4167H12.0834"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
      />
    </svg>
  );
};

export const EditIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 20 20"
      width="1em"
      {...props}
    >
      <path
        d="M11.05 3.00002L4.20835 10.2417C3.95002 10.5167 3.70002 11.0584 3.65002 11.4334L3.34169 14.1334C3.23335 15.1084 3.93335 15.775 4.90002 15.6084L7.58335 15.15C7.95835 15.0834 8.48335 14.8084 8.74168 14.525L15.5834 7.28335C16.7667 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2334 1.75002 11.05 3.00002Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
      <path
        d="M2.5 18.3333H17.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        strokeWidth={1.5}
      />
    </svg>
  );
};

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [viewProductModalOpen, setViewProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const openModal = (product) => {
    setSelectedProduct(product);
    setViewProductModalOpen(true);
  };

  const closeModal = () => {
    setViewProductModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("/Products/GET/SearchProductByName", {
        params: {
          searchQuery,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Errore nella ricerca dei prodotti:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/Products/GET/GetAllProducts");

        const products = response.data;

        for (let product of products) {
          if (product.CategoryId) {
            const categoryResponse = await axios.get(
              `/Products/GET/GetCategoryById/${product.CategoryId}`
            );

            if (
              Array.isArray(categoryResponse.data) &&
              categoryResponse.data.length > 0
            ) {
              const category = categoryResponse.data[0];
              if (category.CategoryName) {
                product.CategoryName = category.CategoryName;
              } else {
                console.warn(
                  `Categoria non trovata per ID: ${product.CategoryId}`
                );
              }
            } else {
              console.warn(
                `Nessuna categoria trovata per ID: ${product.CategoryId}`
              );
            }
          }
        }

        setProducts(products);
      } catch (error) {
        console.error("Errore durante il fetch dei prodotti:", error);
      }
    };

    if (!searchQuery) {
      fetchProducts();
    }
    fetchProducts();
  }, [searchQuery]);

  const renderCell = React.useCallback((product, columnKey) => {
    const cellValue = product[columnKey];

    switch (columnKey) {
      case "id":
        return product.ProductId; // Mostra l'id del prodotto
      case "name":
        return product.ProductName; // Mostra il nome del prodotto
      case "description":
        return product.ProductDescription; // Mostra la descrizione del prodotto
      case "quantity":
        return product.ProductAmount; // Mostra la quantità del prodotto
      case "actions":
        return (
          <div className="flex justify-center items-center gap-2">
            <Tooltip content="Dettagli prodotto">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={() => openModal(product)} // Passa il prodotto al modal
              >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Modifica prodotto">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Elimina prodotto">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  return (
    <div className="relative">
      <Table
        aria-label="Example table with custom cells"
        topContent={
          <div className="flex flex-row justify-between gap-3 items-center">
            <div className="flex flex-row gap-3 w-full">
              <Input
                radius="full"
                variant="bordered"
                startContent={<SearchOutlinedIcon className="text-gray-400" />}
                className="w-full md:w-1/3"
                placeholder="Cerca per nome prodotto..."
                value={searchQuery}
                onChange={handleSearchChange}
              />

              <Button
                color="primary"
                radius="full"
                endContent={<SearchOutlinedIcon />}
                className="hidden sm:flex"
                onClick={handleSearch}
              >
                Cerca
              </Button>
            </div>

            <Button
              color="primary"
              radius="full"
              startContent={<AddOutlinedIcon />}
              className="min-w-fit"
            >
              Aggiungi Prodotto
            </Button>
          </div>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={products}>
          {(item) => (
            <TableRow key={item.ProductId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Mostra il modal solo se è aperto */}
      {viewProductModalOpen && (
        <ViewProductModal
          isOpen={viewProductModalOpen}
          isClosed={closeModal}
          ProductData={selectedProduct}
        />
      )}
    </div>
  );
}
