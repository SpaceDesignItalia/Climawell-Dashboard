import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  useDisclosure,
  Chip,
  Image,
} from "@heroui/react";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL_IMG } from "../../../../API/API";

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
}

interface ViewProductModalProps {
  ProductData: Product | null;
}

export default function ViewProductModal({
  ProductData,
}: ViewProductModalProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isProductLoaded, setIsProductLoaded] = useState(false);
  const [productImages, setProductImages] = useState([]);

  // Controlla se ProductData è caricato usando useEffect
  useEffect(() => {
    const isValid = !!ProductData && !!ProductData.ProductName;
    fetchProductImages();
    setIsProductLoaded(isValid);
  }, [ProductData]);

  async function fetchProductImages() {
    try {
      const res = await axios.get("/Products/GET/GetImagesByProductId", {
        params: { ProductId: ProductData?.ProductId },
      });

      console.log(res.data);
      if (res.status == 200) {
        setProductImages(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <>
      <Tooltip
        content={isProductLoaded ? "Dettagli prodotto" : "Caricamento dati..."}
      >
        <Button
          onClick={onOpen}
          variant="light"
          size="sm"
          isIconOnly
          disabled={!isProductLoaded} // Prop corretta per disabilitare il bottone
        >
          <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
        </Button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="outside"
        placement="center"
        backdrop="blur"
      >
        {isProductLoaded ? (
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Anteprima di {ProductData?.ProductName}
            </ModalHeader>
            <ModalBody>
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  {/* Campo: In evidenza */}
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      In evidenza
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <Chip
                        color={ProductData?.isFeatured ? "success" : "danger"}
                        variant="flat"
                      >
                        <div className="font-semibold">
                          {ProductData?.isFeatured
                            ? "In evidenza"
                            : "Non in evidenza"}
                        </div>
                      </Chip>
                    </dd>
                  </div>
                  {/* Campo: Categoria */}
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Categoria
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {ProductData?.CategoryName}
                    </dd>
                  </div>
                  {/* Campo: Descrizione */}
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Descrizione
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {ProductData?.ProductDescription}
                    </dd>
                  </div>
                  {/* Campo: Prezzo unitario */}
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Prezzo unitario
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {ProductData?.UnitPrice} €
                    </dd>
                  </div>
                  {/* Campo: Dimensioni */}
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Dimensioni (L x P x H)
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {ProductData?.Width} cm x {ProductData?.Depth} cm x{" "}
                      {ProductData?.Height} cm
                    </dd>
                  </div>
                  {/* Campo: Peso */}
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Peso
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {ProductData?.Weight} kg
                    </dd>
                  </div>
                  {/* Campo: Quantità disponibile */}
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Quantità disponibile
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {ProductData?.ProductAmount} unità
                    </dd>
                  </div>

                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Immagini
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 flex flex-col gap-5">
                      {productImages.map((image: any) => (
                        <Image
                          width={400}
                          height={400}
                          alt={image.ProductImageUrl}
                          src={
                            API_URL_IMG +
                            "/uploads/ProductImages/" +
                            image.ProductImageUrl
                          }
                          className="rounded-lg w-auto border-2"
                        />
                      ))}
                    </dd>
                  </div>
                </dl>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onClick={onClose}
                radius="sm"
              >
                Chiudi
              </Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalBody>
              <p className="text-center text-sm text-gray-500">
                Nessun dato prodotto disponibile.
              </p>
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
