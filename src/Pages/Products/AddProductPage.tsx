import { Select, SelectItem, Input, Button } from "@nextui-org/react";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AddProductPage() {
  const [productData, setProductData] = useState({
    ProductName: "",
    ProductPrice: "",
    ProductQuantity: "",
    ProductCategory: "",
  });

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    await axios.get("/Products/GET/GetAllCategories").then((res) => {
      setCategories(res.data);
    });
  };

  const addProduct = async () => {
    await axios.post("/Products/POST/AddProduct", productData).then((res) => {
      console.log(res.data);
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const [isSaving, setIsSaving] = useState(false);

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

  const checkAllDataCompiled = () => {
    return (
      !productData.ProductName ||
      !productData.ProductPrice ||
      !productData.ProductQuantity
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
                      aria-label="Nome Prodotto"
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
                      placeholder="Inserisci il prezzo"
                      value={productData.ProductPrice}
                      onChange={handleChange}
                      aria-label="Prezzo"
                      fullWidth
                    />
                  </div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      htmlFor="ProductQuantity"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Quantità <span className="text-red-600 font-bold">*</span>
                    </label>
                    <Input
                      variant="bordered"
                      type="number"
                      radius="full"
                      name="ProductQuantity"
                      placeholder="Inserisci la quantità"
                      value={productData.ProductQuantity}
                      onChange={handleChange}
                      aria-label="Quantità"
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
                      aria-label="Categoria"
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
                  {isSaving ? "Salvando il prodotto..." : "Salva Prodotto"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
