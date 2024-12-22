import {
  Select,
  SelectItem,
  Input,
  Button,
  Textarea,
  Image,
} from "@nextui-org/react";
import SaveIcon from "@mui/icons-material/Save";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import { useEffect, useState } from "react";
import axios from "axios";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

export default function AddProductPage() {
  const [productData, setProductData] = useState({
    ProductName: "",
    ProductPrice: "",
    ProductQuantity: "",
    ProductCategory: "",
    ProductDepth: "",
    ProductHeight: "",
    ProductWidth: "",
    ProductWeight: "",
    ProductModel: "",
    ProductDescription: "",
    IsFeatured: "",
    ProductImages: [],
  });

  const [categories, setCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/Products/GET/GetAllCategories");
      setCategories(res.data);
    } catch (error) {
      console.error("Errore durante il caricamento delle categorie:", error);
    }
  };

  const addProduct = async () => {
    try {
      const res = await axios.post("/Products/POST/AddProduct", productData);
      console.log(res.data);
      // Resetta i dati dopo il salvataggio
      setProductData({
        ProductName: "",
        ProductPrice: "",
        ProductQuantity: "",
        ProductCategory: "",
        ProductDepth: "",
        ProductHeight: "",
        ProductWidth: "",
        ProductWeight: "",
        ProductModel: "",
        ProductDescription: "",
        IsFeatured: "",
        ProductImages: [],
      });
    } catch (error) {
      console.error("Errore durante l'aggiunta del prodotto:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    setIsSaving(true);
    addProduct().then(() => {
      setIsSaving(false);
    });
  };

  const handleRemoveImage = (index) => {
    // Rimuove l'immagine dall'array
    const updatedImages = [...productData.ProductImages];
    updatedImages.splice(index, 1);
    setProductData({ ProductImages: updatedImages });
  };

  const handleAddImage = async (event) => {
    const newImage = event.target.files[0];
    if (newImage) {
      const allowedExtensions = ["image/jpeg", "image/png"];
      if (allowedExtensions.includes(newImage.type)) {
        try {
          // Simula l'upload su un server (sostituisci con il tuo endpoint)
          const formData = new FormData();
          formData.append("file", newImage);

          const res = await axios.post(
            "/Products/POST/UploadImage",
            formData,
            files,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          // Supponendo che il server restituisca l'URL dell'immagine
          const imageUrl = res.data.url;

          setProductData((prevData) => ({
            ...prevData,
            ProductImages: [...prevData.ProductImages, imageUrl],
          }));
        } catch (error) {
          console.error("Errore durante il caricamento dell'immagine:", error);
          alert("Errore durante il caricamento dell'immagine.");
        }
      } else {
        alert("Formato file non supportato. Carica solo immagini JPEG o PNG.");
      }
    }
  };

  const checkAllDataCompiled = () => {
    return (
      !productData.ProductName ||
      !productData.ProductPrice ||
      !productData.ProductQuantity ||
      !productData.ProductDepth ||
      !productData.ProductHeight ||
      !productData.ProductWidth ||
      !productData.ProductWeight ||
      !productData.IsFeatured ||
      productData.ProductImages.length === 0
    );
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
                <div className="grid grid-cols-6 gap-6">
                  {/* Nome, Prezzo, Quantità */}
                  <div className="col-span-6 sm:col-span-3">
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
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="ProductPrice"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Prezzo <span className="text-red-600 font-bold">*</span>
                    </label>
                    <Input
                      variant="bordered"
                      type="number"
                      radius="full"
                      name="ProductPrice"
                      placeholder="Inserisci il prezzo unitario"
                      className="text-xs"
                      endContent="€"
                      value={productData.ProductPrice}
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
                      value={productData.ProductCategory}
                      onChange={(e) =>
                        setProductData((prev) => ({
                          ...prev,
                          ProductCategory: e.target.value,
                        }))
                      }
                      fullWidth
                    >
                      {categories.map((category) => (
                        <SelectItem
                          key={category.CategoryId}
                          value={category.CategoryId}
                        >
                          {category.CategoryName}
                        </SelectItem>
                      ))}
                    </Select>
                  </div>
                  {/* Nuovi campi */}
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
                      value={productData.ProductDepth}
                      onChange={handleChange}
                      fullWidth
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="ProductHeight"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Altezza <span className="text-red-600 font-bold">*</span>
                    </label>
                    <Input
                      variant="bordered"
                      type="number"
                      radius="full"
                      name="ProductHeight"
                      placeholder="Inserisci l'altezza"
                      className="text-xs"
                      endContent="cm"
                      value={productData.ProductHeight}
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
                      value={productData.ProductWidth}
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
                      value={productData.ProductWeight}
                      onChange={handleChange}
                      fullWidth
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="ProductModel"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Modello
                    </label>
                    <Input
                      variant="bordered"
                      type="text"
                      radius="full"
                      name="ProductModel"
                      placeholder="Inserisci il modello"
                      value={productData.ProductModel}
                      onChange={handleChange}
                      fullWidth
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
                      htmlFor="IsFeatured"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Prodotto in evidenza{" "}
                      <span className="text-red-600 font-bold">*</span>
                    </label>
                    <Select
                      variant="bordered"
                      radius="full"
                      name="IsFeatured"
                      placeholder="Seleziona"
                      value={productData.IsFeatured}
                      onChange={(e) =>
                        setProductData((prev) => ({
                          ...prev,
                          IsFeatured: e.target.value,
                        }))
                      }
                      fullWidth
                    >
                      <SelectItem value="true">Sì</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </Select>
                  </div>
                  <div className="col-span-6">
                    <label
                      htmlFor="ProductImages"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Immagini
                    </label>
                    <Button
                      as="label"
                      color="primary"
                      radius="full"
                      startContent={<AddPhotoAlternateOutlinedIcon />}
                    >
                      Aggiungi Immagini
                      <input
                        type="file"
                        multiple
                        hidden
                        onChange={handleAddImage}
                      />
                    </Button>
                    <div className="mt-4 flex gap-2">
                      {productData.ProductImages.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={URL.createObjectURL(image)}
                            alt={`Immagine ${index + 1}`}
                            height={200}
                            objectFit="cover" // Assicura che l'immagine mantenga le proporzioni
                          />
                          <Button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 text-white bg-red-600 rounded-full p-1 w-8 h-8"
                            style={{ zIndex: 10 }} // Aggiungi un z-index per garantire che la X sia sopra l'immagine
                          >
                            <CloseOutlinedIcon style={{ color: "white" }} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 text-right sm:px-6">
                <Button
                  color="primary"
                  className="text-white"
                  radius="full"
                  startContent={<SaveIcon />}
                  isDisabled={checkAllDataCompiled()}
                  isLoading={isSaving}
                  onClick={handleAddProduct}
                >
                  {isSaving ? "Salvando il prodotto..." : "Salva prodotto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
