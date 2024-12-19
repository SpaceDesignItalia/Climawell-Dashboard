import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  ProductId: number;
  ProductName: string;
  ProductDescription: string;
  ProductAmount: number;
  UnitPrice: number;
  Weight: number;
  Width: number;
  Height: number;
  Depth: number;
  isFeatured: boolean;
  CategoryId: number;
  CategoryName: string;
  ProductModelGroupId: string;
}

interface ViewProductModalProps {
  isOpen: boolean;
  isClosed: () => void;
  ProductData: Product;
}

export default function ViewProductModal({
  isOpen,
  isClosed,
  ProductData,
}: ViewProductModalProps) {
  const [productDetails, setProductDetails] = useState<Product | null>(null);

  useEffect(() => {
    setProductDetails(ProductData);
  }, [isOpen, ProductData]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={isClosed}
      size="2xl"
      scrollBehavior="inside"
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <span>Anteprima di {ProductData.ProductName}</span>
          {ProductData.IsFeatured ? (
            <Chip className="my-auto" color="success" variant="faded">
              In evidenza
            </Chip>
          ) : (
            <Chip className="my-auto" color="danger" variant="faded">
              Non in evidenza
            </Chip>
          )}
        </ModalHeader>

        <ModalBody>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Nome Prodotto
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {ProductData.ProductName}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Descrizione Prodotto
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {ProductData.ProductDescription}
                </dd>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Categoria
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {ProductData.CategoryName
                    ? ProductData.CategoryName
                    : "Non specificata"}
                </dd>
              </div>
              <div className="flex flex-row px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                <div className="mr-10 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Quantità Prodotto
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                    {ProductData.ProductAmount}
                  </dd>
                </div>
                <div className="ml-10 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Prezzo Unitario
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                    €{ProductData.UnitPrice}
                  </dd>
                </div>
              </div>
              <div className="flex flex-row px-4 py-6 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                <div className="mr-10 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Peso Prodotto
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                    {ProductData.Weight} g
                  </dd>
                </div>
                <div className="ml-10 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Dimensioni (LxPxH)
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-0">
                    {ProductData.Width} x {ProductData.Depth} x{" "}
                    {ProductData.Height} cm
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button color="danger" variant="light" onClick={isClosed} radius="sm">
            Chiudi
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
