import {
  Switch,
  Input,
  Button,
  Textarea,
  Image,
  Checkbox,
  Tabs,
  Tab,
  Autocomplete,
  AutocompleteItem,
} from "@nextui-org/react";
import SaveIcon from "@mui/icons-material/Save";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import StatusAlert from "../../Components/Layout/StatusAlert";
import { useParams } from "react-router-dom";
import { API_URL_IMG } from "../../API/API";
import { form } from "framer-motion/client";

interface Category {
  CategoryId: number;
  CategoryName: string;
}

interface ProductData {
  ProductName: string;
  UnitPrice: number;
  ProductAmount: number;
  CategoryId: number;
  Depth: number;
  Height: number;
  Width: number;
  Weight: number;
  ProductDescription: string;
  IsFeatured: boolean;
  ProductImages: any;
}

const INITIAL_PRODUCTDATA: ProductData = {
  ProductName: "",
  UnitPrice: 0,
  ProductAmount: 0,
  CategoryId: 0,
  Depth: 0,
  Height: 0,
  Width: 0,
  Weight: 0,
  ProductDescription: "",
  IsFeatured: false,
  ProductImages: [],
};

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

export default function AddProductPage() {
  const { productId } = useParams();
  const [productData, setProductData] =
    useState<ProductData>(INITIAL_PRODUCTDATA);
  const [oldProductData, setOldProductData] =
    useState<ProductData>(INITIAL_PRODUCTDATA);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [alertData, setAlertData] = useState<AlertData>(initialAlertData);

  useEffect(() => {
    fetchProductData();
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const res = await axios.get("/Products/GET/GetAllCategories");
      setCategories(res.data);
    } catch (error) {
      console.error("Errore durante il caricamento delle categorie:", error);
    }
  }

  async function fetchProductData() {
    try {
      const res = await axios.get("/Products/GET/GetProductById", {
        params: { ProductId: productId },
      });

      console.log(res.data);
      if (res.status == 200) {
        setOldProductData(res.data);
        setProductData(res.data);
      }
    } catch (error) {
      console.error("Errore durante il recupero del prodotto:", error);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Per i campi numerici, convertiamo il valore in numero
    const newValue = type === "number" ? parseFloat(value) : value;

    setProductData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  async function handleAddProduct() {
    try {
      setIsSaving(true);
      // Crea un nuovo oggetto FormData
      const formData = new FormData();

      // Aggiungi i dati del prodotto alla FormData
      if (productId) {
        formData.append("ProductId", productId);
      }
      formData.append("ProductName", productData.ProductName);
      formData.append("ProductPrice", productData.UnitPrice.toString());
      formData.append("ProductAmount", productData.ProductAmount.toString());
      formData.append("CategoryId", productData.CategoryId.toString());
      formData.append("ProductDepth", productData.Depth.toString());
      formData.append("ProductHeight", productData.Height.toString());
      formData.append("ProductWidth", productData.Width.toString());
      formData.append("ProductWeight", productData.Weight.toString());
      formData.append("ProductDescription", productData.ProductDescription);
      formData.append("IsFeatured", productData.IsFeatured ? "true" : "false");
      const productImageIds = productData.ProductImages.filter(
        (image: any) => image.ProductImageUrl
      ).map((image: any) => image.ProductImageId);
      formData.append("OldImages", JSON.stringify(productImageIds));

      // Aggiungi le immagini del prodotto (se presenti)
      productData.ProductImages.forEach((image: any) => {
        formData.append("files", image); // Same field name for all images
      });

      console.log(formData);

      // Esegui la richiesta POST per aggiungere il prodotto
      const response = await axios.post(
        "/Products/UPDATE/UpdateProduct",
        formData
      );

      // Gestisci la risposta
      if (response.status === 200) {
        setAlertData({
          isOpen: true,
          onClose: () => setAlertData((prev) => ({ ...prev, isOpen: false })),
          alertTitle: "Operazione completata",
          alertDescription: "Prodotto aggiunto con successo",
          alertColor: "green",
        });
        window.location.href = "/products";
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
              "Esiste già un prodotto con questo nome. Per favore, usa un nome differente.",
            alertColor: "yellow",
          });
        } else {
          // Messaggio di errore generico in caso di altri problemi con la richiesta
          setAlertData({
            isOpen: true,
            onClose: () => setAlertData((prev) => ({ ...prev, isOpen: false })),
            alertTitle: "Errore durante l'operazione",
            alertDescription:
              "Si è verificato un errore durante l'aggiunta del prodotto. Per favore, riprova più tardi.",
            alertColor: "red",
          });
        }
        console.error("Errore durante l'aggiunta del prodotto:", error);
      }
    }
  }

  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const allowedExtensions = ["image/jpeg", "image/png"];
      const selectedImages = Array.from(files).filter((file) =>
        allowedExtensions.includes(file.type)
      );

      setProductData((prev) => ({
        ...prev,
        ProductImages: [...prev.ProductImages, ...selectedImages],
      }));

      const imagePreviews = selectedImages.map((file) =>
        URL.createObjectURL(file)
      );

      setLocalImages((prev) => [...prev, ...imagePreviews]);
    }
  };

  const handleCheckboxChange = (index: number) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : [...prevSelected, index]
    );
  };

  const handleRemoveSelectedImages = (selectedIndexes: number[]) => {
    const updatedImages = productData.ProductImages.filter(
      (_, index) => !selectedIndexes.includes(index)
    );

    const updatedLocalImages = localImages.filter(
      (_, index) => !selectedIndexes.includes(index)
    );

    setProductData((prev) => ({ ...prev, ProductImages: updatedImages }));
    setLocalImages(updatedLocalImages);
    setSelectedImages([]);
  };

  const checkAllDataCompiled = () => {
    return (
      productData.ProductName !== oldProductData.ProductName ||
      productData.ProductDescription !== oldProductData.ProductDescription ||
      productData.ProductAmount !== oldProductData.ProductAmount ||
      productData.UnitPrice !== oldProductData.UnitPrice ||
      productData.CategoryId !== oldProductData.CategoryId ||
      productData.Height !== oldProductData.Height ||
      productData.Depth !== oldProductData.Depth ||
      productData.Width !== oldProductData.Width ||
      productData.Weight !== oldProductData.Weight ||
      productData.IsFeatured !== oldProductData.IsFeatured
    );
  };

  return (
    <div className="py-10 m-0 lg:ml-72">
      <StatusAlert AlertData={alertData} />
      <header>
        <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Modifica Prodotto
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
                    Modifica Prodotto
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 sm:w-1/3">
                    Compila i campi sottostanti per modificare un prodotto al
                    database. I campi contrassegnati con un asterisco (
                    <span className="text-danger font-bold">*</span>) sono
                    obbligatori.
                  </p>
                </div>
                <Tabs aria-label="Options" variant="underlined">
                  <Tab key="descrizione" title="Descrizione">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="ProductName"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Nome Prodotto{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="text"
                          radius="full"
                          name="ProductName"
                          placeholder="Inserisci il nome del prodotto"
                          value={productData.ProductName}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-2 flex flex-col justify-center">
                        <label
                          htmlFor="IsFeatured"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Prodotto in evidenza{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Switch
                          isSelected={Boolean(productData.IsFeatured)}
                          onValueChange={(value) =>
                            setProductData({
                              ...productData,
                              IsFeatured: Boolean(value),
                            })
                          }
                        />
                      </div>

                      <div className="col-span-6">
                        <label
                          htmlFor="ProductDescription"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Descrizione{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Textarea
                          variant="bordered"
                          radius="full"
                          name="ProductDescription"
                          placeholder="Inserisci una descrizione"
                          value={productData.ProductDescription}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="ProductPrice"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Prezzo{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="ProductPrice"
                          placeholder="Inserisci il prezzo unitario"
                          className="text-xs"
                          endContent="€"
                          value={String(productData.UnitPrice)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="ProductAmount"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Quantità in Magazzino{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="ProductAmount"
                          placeholder="Inserisci la quantità in magazzino"
                          className="text-xs"
                          value={String(productData.ProductAmount)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="CategoryId"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Categoria
                        </label>
                        <Autocomplete
                          variant="bordered"
                          radius="full"
                          name="CategoryId"
                          placeholder="Seleziona una categoria"
                          selectedKey={String(productData.CategoryId)}
                          onSelectionChange={(e) =>
                            setProductData((prev) => ({
                              ...prev,
                              CategoryId: Number(e),
                            }))
                          }
                        >
                          {categories.map((category: Category) => (
                            <AutocompleteItem
                              key={category.CategoryId}
                              value={category.CategoryId}
                            >
                              {category.CategoryName}
                            </AutocompleteItem>
                          ))}
                        </Autocomplete>
                      </div>

                      <div className="col-span-6 flex flex-col gap-5">
                        <label
                          htmlFor="ProductImages"
                          className="block text-sm font-medium leading-6 text-gray-900 mb-2"
                        >
                          Immagini
                        </label>
                        {productData.ProductImages.length !== 0 && (
                          <div className="flex flex-row justify-between">
                            <Button
                              as="label"
                              color="primary"
                              radius="full"
                              startContent={<AddPhotoAlternateOutlinedIcon />}
                              className="flex items-center gap-2 px-4 py-2 hover:shadow-lg"
                            >
                              Aggiungi Immagini
                              <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg, image/gif"
                                multiple
                                hidden
                                onChange={handleAddImage}
                              />
                            </Button>

                            {selectedImages.length > 0 && (
                              <Button
                                type="button"
                                onClick={() =>
                                  handleRemoveSelectedImages(selectedImages)
                                }
                                startContent={<DeleteOutlineRoundedIcon />}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                              >
                                Elimina {selectedImages.length} Immagin
                                {selectedImages.length > 1 ? "i" : "e"}
                              </Button>
                            )}
                          </div>
                        )}

                        <div className="flex flex-row flex-wrap gap-5">
                          {productData.ProductImages.length === 0 ? (
                            <label
                              htmlFor="file-upload"
                              className="flex flex-col items-center justify-center w-full p-12 border-2 border-dashed rounded-lg border-gray-300 hover:border-gray-400 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 cursor-pointer"
                            >
                              <AddAPhotoRoundedIcon sx={{ fontSize: 40 }} />
                              <span className="mt-2 block text-sm font-semibold text-gray-900">
                                Carica un file
                              </span>
                              <span className="block text-sm text-gray-500">
                                PNG, JPG, GIF
                              </span>
                              <input
                                id="file-upload"
                                type="file"
                                onChange={handleAddImage}
                                multiple
                                accept="image/png, image/jpeg, image/jpg, image/gif"
                                className="sr-only"
                              />
                            </label>
                          ) : (
                            productData.ProductImages.map(
                              (image: any, index: number) =>
                                index == 0 ? (
                                  <div
                                    key={index}
                                    className="border-2 rounded-lg shadow-sm w-fit"
                                  >
                                    <div className="flex flex-row items-center justify-between  p-3">
                                      <Checkbox
                                        checked={selectedImages.includes(index)}
                                        onChange={() =>
                                          handleCheckboxChange(index)
                                        }
                                      />

                                      <Image
                                        src={
                                          image.ProductImageUrl
                                            ? API_URL_IMG +
                                              "/uploads/ProductImages/" +
                                              image.ProductImageUrl
                                            : URL.createObjectURL(image)
                                        }
                                        width={100}
                                        height={100}
                                        alt={`Immagine ${index + 1}`}
                                        className="w-full object-cover rounded-none"
                                      />
                                    </div>
                                    <div className="p-2 bg-primary text-white rounded-bl-md rounded-br-md flex justify-center uppercase text-sm">
                                      Copertina
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    key={index}
                                    className="border-2 rounded-lg shadow-sm flex flex-row items-center justify-between w-fit p-3"
                                  >
                                    <Checkbox
                                      checked={selectedImages.includes(index)}
                                      onChange={() =>
                                        handleCheckboxChange(index)
                                      }
                                    />

                                    <Image
                                      src={
                                        image.ProductImageUrl
                                          ? API_URL_IMG +
                                            "/uploads/ProductImages/" +
                                            image.ProductImageUrl
                                          : URL.createObjectURL(image)
                                      }
                                      width={100}
                                      height={100}
                                      alt={`Immagine ${index + 1}`}
                                      className="w-full object-cover rounded-none"
                                    />
                                  </div>
                                )
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab key="dimensioni" title="Dimensioni">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="Depth"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Profondità{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="Depth"
                          placeholder="Inserisci la profondità"
                          className="text-xs"
                          endContent="cm"
                          value={String(productData.Depth)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="Height"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Altezza{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="Height"
                          placeholder="Inserisci l'altezza"
                          className="text-xs"
                          endContent="cm"
                          value={String(productData.Height)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="Width"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Larghezza{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="Width"
                          placeholder="Inserisci la larghezza"
                          className="text-xs"
                          endContent="cm"
                          value={String(productData.Width)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="Weight"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Peso <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="Weight"
                          placeholder="Inserisci il peso"
                          className="text-xs"
                          endContent="Kg"
                          value={String(productData.Weight)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                    </div>
                  </Tab>
                </Tabs>
              </div>
              <div className="px-4 py-3 text-right sm:px-6">
                <Button
                  color="primary"
                  className="text-white"
                  radius="full"
                  startContent={!isSaving && <SaveIcon />}
                  isLoading={isSaving}
                  isDisabled={!checkAllDataCompiled()}
                  onClick={() => handleAddProduct()}
                >
                  Salva modifiche
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
