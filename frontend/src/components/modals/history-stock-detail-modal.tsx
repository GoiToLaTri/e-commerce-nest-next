import { useStockHistoryDetail } from "@/hooks/useStockHistoryDetail";
import { Button, Descriptions, Divider, Modal, Skeleton } from "antd";
import React, { useState } from "react";

export interface HistoryStockDetailModalProps {
  id: string;
}

export default function HistoryStockDetailModal({
  id,
}: HistoryStockDetailModalProps) {
  const { data, isLoading } = useStockHistoryDetail({ id });
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
          Detail
        </Button>
      </div>
      <Modal
        title={`Stock detail`}
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
        width={400}
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
          {data && (
            <Descriptions
              title="Product Specification"
              column={1}
              styles={{
                title: {
                  fontSize: "20px",
                  lineHeight: "1.75rem",
                  fontWeight: 600,
                  color: "#fff",
                },
                label: { fontSize: "16px" },
                content: { fontSize: "16px" },
              }}
            >
              <Descriptions.Item label="Product">
                {data.product_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Change type">
                {data.change_type || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Change type">
                {data.supplier_name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Reason">
                {data.reference.reason || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Note">
                {data.reference.note || "-"}
              </Descriptions.Item>
            </Descriptions>
          )}
        </div>
      </Modal>
    </>
  );
}
