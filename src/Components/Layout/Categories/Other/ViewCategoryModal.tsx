import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tooltip,
  useDisclosure,
} from "@heroui/react";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import { useEffect, useState } from "react";

interface Category {
  CategoryId: number;
  CategoryName: string;
}

interface ViewCategoryModalProps {
  CategoryData: Category | null;
}

export default function ViewCategoryModal({
  CategoryData,
}: ViewCategoryModalProps) {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [isCategoryLoaded, setIsCategoryLoaded] = useState(false);

  // Controlla se CategoryData è caricato usando useEffect
  useEffect(() => {
    const isValid = !!CategoryData && !!CategoryData.CategoryName;
    setIsCategoryLoaded(isValid);
  }, [CategoryData]);

  return (
    <>
      <Tooltip
        content={
          isCategoryLoaded ? "Dettagli categoria" : "Caricamento dati..."
        }
      >
        <Button
          onClick={onOpen}
          variant="light"
          size="sm"
          isIconOnly
          disabled={!isCategoryLoaded} // Prop corretta per disabilitare il bottone
        >
          <VisibilityRoundedIcon sx={{ fontSize: 20 }} />
        </Button>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="2xl"
        scrollBehavior="inside"
        placement="center"
        backdrop="blur"
      >
        {isCategoryLoaded ? (
          <ModalContent>
            <ModalHeader className="flex flex-col gap-1">
              Anteprima di {CategoryData?.CategoryName}
            </ModalHeader>
            <ModalBody>
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Nome Categoria
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {CategoryData?.CategoryName}
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
                Nessun dato categoria disponibile.
              </p>
            </ModalBody>
          </ModalContent>
        )}
      </Modal>
    </>
  );
}
