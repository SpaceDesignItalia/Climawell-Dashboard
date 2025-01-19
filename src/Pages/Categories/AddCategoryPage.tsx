import { Input, Button } from "@heroui/react";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import axios from "axios";
import StatusAlert from "../../Components/Layout/StatusAlert";

interface AlertData {
  isOpen: boolean;
  onClose: () => void;
  alertTitle: string;
  alertDescription: string;
  alertColor: "green" | "red" | "yellow";
}

const initialAlertData: AlertData = {
  isOpen: false,
  onClose: () => {},
  alertTitle: "",
  alertDescription: "",
  alertColor: "red",
};

export default function AddCategoryPage() {
  const [categoryName, setCategoryName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [alertData, setAlertData] = useState<AlertData>(initialAlertData);

  const HandleAddCategory = async () => {
    try {
      setIsSaving(true);
      const res = await axios.post("/Products/POST/AddCategory", {
        CategoryName: categoryName,
      });

      if (res.status == 200) {
        setAlertData({
          isOpen: true,
          onClose: () => setAlertData((prev) => ({ ...prev, isOpen: false })),
          alertTitle: "Operazione completata",
          alertDescription: "Categoria aggiunta con successo",
          alertColor: "green",
        });
        window.location.href = "/categories";
      }
    } catch (error) {
      setIsSaving(false);
      if (axios.isAxiosError(error)) {
        // Controllo dell'errore specifico 409 (azienda con lo stesso nome)
        if (error.response?.status === 409) {
          setAlertData({
            isOpen: true,
            onClose: () => setAlertData((prev) => ({ ...prev, isOpen: false })),
            alertTitle: "Conflitto durante l'operazione",
            alertDescription:
              "Esiste già una categoria con questo nome. Per favore, usa un nome differente.",
            alertColor: "yellow",
          });
        } else {
          // Messaggio di errore generico in caso di altri problemi con la richiesta
          setAlertData({
            isOpen: true,
            onClose: () => setAlertData((prev) => ({ ...prev, isOpen: false })),
            alertTitle: "Errore durante l'operazione",
            alertDescription:
              "Si è verificato un errore durante l'aggiunta della categoria. Per favore, riprova più tardi.",
            alertColor: "red",
          });
        }
        console.error("Errore durante l'aggiunta della categoria:", error);
      }
    }
  };

  return (
    <div className="py-10 m-0 lg:ml-72">
      <StatusAlert AlertData={alertData} />
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
                    startContent={!isSaving && <SaveIcon />}
                    onClick={HandleAddCategory}
                    isLoading={isSaving}
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
