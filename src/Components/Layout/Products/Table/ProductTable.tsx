import React, { useState, useEffect, useCallback } from "react";
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
  Spinner,
  Pagination,
  Chip,
  Image,
} from "@nextui-org/react";
import axios from "axios";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ViewProductModal from "../Other/ViewProductModal";
import ConfirmDeleteModal from "../Other/ConfirmDeleteModal";
import { API_URL_IMG } from "../../../../API/API";

export const columns = [
  { name: "Nome Prodotto", uid: "ProductName" },
  { name: "In evidenza", uid: "isFeatured" },
  { name: "Magazzino", uid: "ProductAmount" },
  { name: "Categoria", uid: "CategoryName" },
  { name: "Prezzo", uid: "UnitPrice" },
  { name: "Azioni", uid: "actions" },
];

interface Product {
  CategoryId: number;
  CategoryName: string;
  Depth: number;
  Height: number;
  ProductAmount: number;
  ProductDescription: string;
  ProductId: number;
  ProductImageId: number;
  ProductImageUrl: string;
  ProductName: string;
  UnitPrice: number;
  Weight: number;
  Width: number;
  isFeatured: boolean;
  FirstImage: string;
}

export default function ProductTable() {
  // Stato per le categorie
  const [products, setProducts] = useState<Product[]>([]);
  // Stato per la query di ricerca
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Stato per il loading
  const [isLoading, setLoading] = useState<boolean>(true);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;

  const pages = Math.ceil(products.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return products.slice(start, end);
  }, [page, products]);

  // Funzione per eliminare una categoria
  async function DeleteProduct(ProductData: Product) {
    try {
      const res = await axios.delete(`/Products/DELETE/DeleteProduct`, {
        params: { ProductData },
      });

      if (res.status === 200) {
        fetchProducts();
      }
    } catch (error) {
      console.error("Errore nella cancellazione della categoria:", error);
    }
  }

  // Funzione di ricerca delle categorie
  const handleSearch = async () => {
    setLoading(true);
    if (searchQuery === "") {
      fetchProducts();
    } else {
      try {
        const res = await axios.get(`/Products/GET/SearchProductByName`, {
          params: { searchQuery },
        });
        setProducts(res.data);
      } catch (err) {
        console.error("Errore durante la ricerca della categoria:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Gestione del cambiamento del campo di ricerca
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Funzione per recuperare tutte le categorie
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/Products/GET/GetAllProducts");
      console.log(response.data);
      setProducts(response.data);
    } catch (error) {
      console.error("Errore durante il fetch delle categorie:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Funzione per il rendering dinamico delle celle
  const renderCell = useCallback((product: Product, columnKey: React.Key) => {
    switch (columnKey) {
      case "ProductName":
        return (
          <div className="flex flex-row items-center gap-2 truncate ml-1">
            <Image
              width={70}
              radius="none"
              src={API_URL_IMG + "/uploads/ProductImages/" + product.FirstImage}
            />
            {product.ProductName}
          </div>
        );
      case "isFeatured":
        return (
          <Chip
            color={product.isFeatured ? "success" : "danger"}
            variant="flat"
          >
            <div className="font-semibold">
              {product.isFeatured ? "In evidenza" : "Non in evidenza"}
            </div>
          </Chip>
        );
      case "CategoryName":
        return product.CategoryName;
      case "ProductAmount":
        return <div>{product.ProductAmount} unità</div>;
      case "UnitPrice":
        return <div>{product.UnitPrice} € </div>;
      case "actions":
        return (
          <div className="flex justify-center items-center gap-2">
            <ViewProductModal ProductData={product} />
            <Tooltip content="Modifica prodotto">
              <Button
                as="a"
                href={`/products/edit-product/${product.ProductId}`}
                variant="light"
                size="sm"
                isIconOnly
              >
                <EditRoundedIcon className="text-warning-400" />
              </Button>
            </Tooltip>
            <ConfirmDeleteModal
              ProductData={product}
              DeleteProduct={DeleteProduct}
            />
          </div>
        );
      default:
        return product[columnKey as keyof Product];
    }
  }, []);

  return (
    <div className="relative">
      <Table
        aria-label="Tabella delle categorie"
        isStriped
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
              as="a"
              color="primary"
              radius="full"
              startContent={<AddOutlinedIcon />}
              className="min-w-fit"
              href="/products/add-product"
            >
              Aggiungi prodotto
            </Button>
          </div>
        }
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              radius="full"
              color="primary"
              page={page}
              total={pages || 1}
              onChange={(page) => setPage(page)}
            />
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

        {/* Usa isLoading in TableBody */}
        <TableBody
          items={items}
          isLoading={isLoading}
          loadingContent={<Spinner color="primary" />}
        >
          {(item: Product) => (
            <TableRow key={item.CategoryId}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
