import { useOrder } from "@/hooks/useOrder";
import { Button, Modal, Skeleton } from "antd";
import React, { useState } from "react";
import { UpdateOrdersStatusForm } from "../forms";

export interface UpdateOrderStatusModalProps {
  id: string;
}

export default function UpdateOrderStatusModal({
  id,
}: UpdateOrderStatusModalProps) {
  const { data, isLoading } = useOrder(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClose, setIsModalClose] = useState<boolean>(false);
  const showModal = () => {
    setIsModalOpen(true);
    setIsModalClose(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setIsModalClose(true);
  };

  const handleCancel = () => {
    setTimeout(() => setIsModalOpen(false), 120);
    setIsModalClose(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          type="text"
          className="!bg-[#924dff] leading-[1.6] !py-[0.75rem] hover:!bg-[#7b3edc] transition-colors duration-300"
          onClick={showModal}
        >
          Update
        </Button>
      </div>
      <Modal
        title={`Order detail`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={600}
        centered
        transitionName=""
        maskTransitionName=""
        wrapClassName="custom-modal-wrapper"
        modalRender={(modal) => (
          <div
            className={`custom-modal-content ${
              isModalClose ? "modal-close-animation" : "modal-open-animation"
            }`}
          >
            {modal}
          </div>
        )}
      >
        <div className="mt-8">
          {isLoading && <Skeleton />}
          {data && <UpdateOrdersStatusForm data={data} handleCancel={handleCancel}/>}
        </div>
      </Modal>
    </>
  );
}
