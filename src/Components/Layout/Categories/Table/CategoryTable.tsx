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
} from "@nextui-org/react";
import axios from "axios";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ViewCategoryModal from "../Other/ViewCategoryModal";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ConfirmDeleteModal from "../Other/ConfirmDeleteModal";

export const columns = [
  { name: "Nome", uid: "name" },
  { name: "Azioni", uid: "actions" },
];

interface Category {
  CategoryId: number;
  CategoryName: string;
}

export default function ProductTable() {
  // Stato per le categorie
  const [categories, setCategories] = useState<Category[]>([]);
  // Stato per la query di ricerca
  const [searchQuery, setSearchQuery] = useState<string>("");
  // Stato per il loading
  const [isLoading, setLoading] = useState<boolean>(true);

  const [page, setPage] = React.useState(1);
  const rowsPerPage = 15;

  const pages = Math.ceil(categories.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return categories.slice(start, end);
  }, [page, categories]);

  // Funzione per eliminare una categoria
  async function DeleteCategory(CategoryData: Category) {
    try {
      const res = await axios.delete(`/Products/DELETE/DeleteCategory`, {
        params: { CategoryData },
      });

      if (res.status === 200) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Errore nella cancellazione della categoria:", error);
    }
  }

  // Funzione di ricerca delle categorie
  const handleSearch = async () => {
    setLoading(true);
    if (searchQuery === "") {
      fetchCategories();
    } else {
      try {
        const res = await axios.get(`/Products/GET/SearchCategoryByName`, {
          params: { searchQuery },
        });
        setCategories(res.data);
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
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/Products/GET/GetAllCategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Errore durante il fetch delle categorie:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Funzione per il rendering dinamico delle celle
  const renderCell = useCallback((category: Category, columnKey: React.Key) => {
    switch (columnKey) {
      case "name":
        return category.CategoryName;
      case "actions":
        return (
          <div className="flex justify-center items-center gap-2">
            <ViewCategoryModal CategoryData={category} />

            <Tooltip content="Modifica categoria">
              <Button
                as="a"
                href={`/categories/edit-category/${category.CategoryId}`}
                variant="light"
                size="sm"
                isIconOnly
              >
                <EditRoundedIcon className="text-warning-400" />
              </Button>
            </Tooltip>

            <ConfirmDeleteModal
              CategoryData={category}
              DeleteCategory={DeleteCategory}
            />
          </div>
        );
      default:
        return category[columnKey as keyof Category];
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
                placeholder="Cerca per nome categoria..."
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
              href="/categories/add-category"
            >
              Aggiungi categoria
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
          {(item: Category) => (
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
