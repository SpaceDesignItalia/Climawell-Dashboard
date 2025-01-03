import {
  Select,
  SelectItem,
  Switch,
  Input,
  Button,
  Textarea,
  Image,
  Checkbox,
  Tabs,
  Tab,
} from "@nextui-org/react";
import SaveIcon from "@mui/icons-material/Save";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";

interface Category {
  CategoryId: number;
  CategoryName: string;
}

interface ProductData {
  ProductName: string;
  ProductPrice: number;
  ProductQuantity: number;
  ProductCategoryId: number;
  ProductDepth: number;
  ProductHeight: number;
  ProductWidth: number;
  ProductWeight: number;
  ProductStock: number;
  ProductDescription: string;
  IsFeatured: boolean;
  ProductImages: Blob[];
}

const INITIAL_PRODUCTDATA: ProductData = {
  ProductName: "",
  ProductPrice: 0,
  ProductQuantity: 0,
  ProductCategoryId: 0,
  ProductDepth: 0,
  ProductHeight: 0,
  ProductWidth: 0,
  ProductWeight: 0,
  ProductStock: 0,
  ProductDescription: "",
  IsFeatured: false,
  ProductImages: [],
};

export default function AddProductPage() {
  const [productData, setProductData] =
    useState<ProductData>(INITIAL_PRODUCTDATA);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/Products/GET/GetAllCategories");
      setCategories(res.data);
    } catch (error) {
      console.error("Errore durante il caricamento delle categorie:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
    console.log(productData);

    try {
      // Crea un nuovo oggetto FormData
      const formData = new FormData();

      // Aggiungi i dati del prodotto alla FormData
      formData.append("ProductName", productData.ProductName);
      formData.append("ProductPrice", productData.ProductPrice.toString());
      formData.append(
        "ProductQuantity",
        productData.ProductQuantity.toString()
      );
      formData.append("CategoryId", productData.ProductCategoryId.toString());
      formData.append("ProductDepth", productData.ProductDepth.toString());
      formData.append("ProductHeight", productData.ProductHeight.toString());
      formData.append("ProductWidth", productData.ProductWidth.toString());
      formData.append("ProductWeight", productData.ProductWeight.toString());
      formData.append("ProductStock", productData.ProductStock.toString());
      formData.append("ProductDescription", productData.ProductDescription);
      formData.append("IsFeatured", productData.IsFeatured ? "true" : "false");

      // Aggiungi le immagini del prodotto (se presenti)
      productData.ProductImages.forEach((image, index) => {
        formData.append(`ProductImages[${index}]`, image);
      });

      // Esegui la richiesta POST per aggiungere il prodotto
      const response = await axios.post("/Products/POST/AddProduct", formData);

      // Gestisci la risposta
      if (response.status === 200) {
        console.log("Prodotto aggiunto con successo");
        // Puoi fare altre azioni qui, come un redirect o una notifica
      }
    } catch (error) {
      console.error("Errore durante l'aggiunta del prodotto:", error);
      // Gestisci eventuali errori qui
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
    return true;
  };

  return (
    <div className="py-10 m-0 lg:ml-72">
      <header>
        <div className="flex flex-col gap-3 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            Aggiungi Prodotto
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
                    Aggiungi Prodotto
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 sm:w-1/3">
                    Compila i campi sottostanti per aggiungere un nuovo prodotto
                    al database. I campi contrassegnati con un asterisco (
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
                          Descrizione
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
                          value={String(productData.ProductPrice)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="ProductStock"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Quantità in Magazzino{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="ProductStock"
                          placeholder="Inserisci la quantità in magazzino"
                          className="text-xs"
                          value={String(productData.ProductStock)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="ProductCategory"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Categoria
                        </label>
                        <Select
                          variant="bordered"
                          radius="full"
                          name="ProductCategory"
                          placeholder="Seleziona una categoria"
                          value={productData.ProductCategoryId}
                          onChange={(e) =>
                            setProductData((prev) => ({
                              ...prev,
                              ProductCategory: Number(e.target.value),
                            }))
                          }
                        >
                          {categories.map((category: Category) => (
                            <SelectItem
                              key={category.CategoryId}
                              value={category.CategoryId}
                            >
                              {category.CategoryName}
                            </SelectItem>
                          ))}
                        </Select>
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
                                accept="image/png, image/jpeg, image/jpg, image/gif"
                                className="sr-only"
                              />
                            </label>
                          ) : (
                            productData.ProductImages.map((image, index) => (
                              <div
                                key={index}
                                className="border-2 rounded-lg shadow-sm flex flex-row items-center justify-between w-fit p-3"
                              >
                                <Checkbox
                                  checked={selectedImages.includes(index)}
                                  onChange={() => handleCheckboxChange(index)}
                                />

                                <Image
                                  src={URL.createObjectURL(image)}
                                  width={100}
                                  height={100}
                                  alt={`Immagine ${index + 1}`}
                                  className="w-full object-cover rounded-none"
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </Tab>
                  <Tab key="dimensioni" title="Dimensioni">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="ProductDepth"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Profondità{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="ProductDepth"
                          placeholder="Inserisci la profondità"
                          className="text-xs"
                          endContent="cm"
                          value={String(productData.ProductDepth)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="ProductHeight"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Altezza{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="ProductHeight"
                          placeholder="Inserisci l'altezza"
                          className="text-xs"
                          endContent="cm"
                          value={String(productData.ProductHeight)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="ProductWidth"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Larghezza{" "}
                          <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="ProductWidth"
                          placeholder="Inserisci la larghezza"
                          className="text-xs"
                          endContent="cm"
                          value={String(productData.ProductWidth)}
                          onChange={handleChange}
                          fullWidth
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="ProductWeight"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Peso <span className="text-red-600 font-bold">*</span>
                        </label>
                        <Input
                          variant="bordered"
                          type="number"
                          radius="full"
                          name="ProductWeight"
                          placeholder="Inserisci il peso"
                          className="text-xs"
                          endContent="Kg"
                          value={String(productData.ProductWeight)}
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
                  startContent={<SaveIcon />}
                  isLoading={isSaving}
                  isDisabled={!checkAllDataCompiled()}
                  onClick={handleAddProduct}
                >
                  Salva Prodotto
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
