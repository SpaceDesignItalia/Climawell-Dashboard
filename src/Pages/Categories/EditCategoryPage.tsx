import { Input, Button } from "@nextui-org/react";
import SaveIcon from "@mui/icons-material/Save";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditCategoryPage() {
  const categoryId = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [originalCategoryName, setOriginalCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Recupera i dati della categoria da modificare
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `/Products/GET/GetCategoryById/${categoryId.categoryId}`
        );
        setCategoryName(res.data[0].CategoryName);
        setOriginalCategoryName(res.data[0].CategoryName);
      } catch (error) {
        console.error("Errore durante il recupero della categoria:", error);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const updateCategory = async () => {
    try {
      const res = await axios.put("/Products/UPDATE/UpdateCategory", {
        CategoryId: categoryId,
        CategoryName: categoryName,
      });

      setOriginalCategoryName(categoryName);

      window.location.href = "/categories";
    } catch (error) {
      console.error("Errore durante l'aggiornamento della categoria:", error);
    }
  };

  const handleUpdateCategory = () => {
    setIsSaving(true);
    updateCategory().then(() => {
      setIsSaving(false);
    });
  };

  return (
    <div className="py-10 m-0 lg:ml-72">
      <header>
        <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Modifica Categoria
          </h1>
        </div>
      </header>
      <main className="px-4 sm:px-6 lg:px-8">
        <div className="py-6 lg:py-8">
          <div className="space-y-6 sm:px-6 lg:col-span-9 lg:px-0">
            <form>
              <div className="space-y-6 bg-white py-6">
                <div>
                  <h3 className="text-base font-semibold leading-6 text-gray-900">
                    Modifica Categoria di prodotti
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 sm:w-1/3">
                    Modifica il campo sottostante per aggiornare una categoria
                    nel database.
                  </p>
                </div>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="CategoryName"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nome Categoria
                    </label>
                    <Input
                      variant="bordered"
                      type="text"
                      radius="full"
                      name="CategoryName"
                      placeholder="Inserisci il nome della categoria"
                      value={categoryName}
                      onChange={(e) => setCategoryName(e.target.value)}
                      fullWidth
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    color="primary"
                    radius="full"
                    startContent={<SaveIcon />}
                    onClick={handleUpdateCategory}
                    isDisabled={
                      !categoryName ||
                      categoryName === originalCategoryName ||
                      isSaving
                    }
                  >
                    {isSaving ? "Salvataggio..." : "Modifica Categoria"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
