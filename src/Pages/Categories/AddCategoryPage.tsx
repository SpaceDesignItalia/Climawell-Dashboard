import { Input, Button } from "@nextui-org/react";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import axios from "axios";

export default function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addCategory = async () => {
    try {
      const res = await axios.post("/Products/POST/AddCategory", {
        CategoryName: categoryName,
      });
      setCategoryName("");
    } catch (error) {
      console.error("Errore durante l'aggiunta della categoria:", error);
    }
  };

  const handleAddCategory = () => {
    setIsSaving(true);
    addCategory().then(() => {
      setIsSaving(false);
    });
  };

  return (
    <div className="py-10 m-0 lg:ml-72">
      <header>
        <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Aggiungi Categoria
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
                    Aggiungi Categoria di prodotti
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 sm:w-1/3">
                    Compila il campo sottostante per aggiungere una nuova
                    categoria al database.
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
                    onClick={handleAddCategory}
                    isDisabled={!categoryName || isSaving}
                  >
                    {isSaving ? "Salvataggio..." : "Salva Categoria"}
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
