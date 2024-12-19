import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  CategoryId: number;
  CategoryName: string;
}

interface ViewCategoryModalProps {
  isOpen: boolean;
  isClosed: () => void;
  CategoryData: Category;
}

export default function ViewCategoryModal({
  isOpen,
  isClosed,
  CategoryData,
}: ViewCategoryModalProps) {
  const [CategoryDetails, setCategoryDetails] = useState<Category | null>(null);

  useEffect(() => {
    setCategoryDetails(CategoryData);
  }, [isOpen, CategoryData]);

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
        <ModalHeader className="flex flex-col gap-1">
          Anteprima di {CategoryData.CategoryName}
        </ModalHeader>
        <ModalBody>
          <div className="mt-6 border-t border-gray-100">
            <dl className="divide-y divide-gray-100">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900">
                  Nome Categoria
                </dt>
                <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                  {CategoryData.CategoryName}
                </dd>
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
